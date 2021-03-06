const CouchDB = require("../../db")
const {
  BUILTIN_ROLES,
  Role,
  getRole,
} = require("../../utilities/security/roles")
const {
  generateRoleID,
  getRoleParams,
  getUserParams,
  ViewNames,
} = require("../../db/utils")

const UpdateRolesOptions = {
  CREATED: "created",
  REMOVED: "removed",
}

async function updateRolesOnUserTable(db, roleId, updateOption) {
  const table = await db.get(ViewNames.USERS)
  const schema = table.schema
  const remove = updateOption === UpdateRolesOptions.REMOVED
  let updated = false
  for (let prop of Object.keys(schema)) {
    if (prop === "roleId") {
      updated = true
      const constraints = schema[prop].constraints
      const indexOf = constraints.inclusion.indexOf(roleId)
      if (remove && indexOf !== -1) {
        constraints.inclusion.splice(indexOf, 1)
      } else if (!remove && indexOf === -1) {
        constraints.inclusion.push(roleId)
      }
      break
    }
  }
  if (updated) {
    await db.put(table)
  }
}

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const body = await db.allDocs(
    getRoleParams(null, {
      include_docs: true,
    })
  )
  const customRoles = body.rows.map(row => row.doc)

  // exclude internal roles like builder
  const staticRoles = [
    BUILTIN_ROLES.ADMIN,
    BUILTIN_ROLES.POWER,
    BUILTIN_ROLES.BASIC,
    BUILTIN_ROLES.PUBLIC,
  ]
  ctx.body = [...staticRoles, ...customRoles]
}

exports.find = async function(ctx) {
  ctx.body = await getRole(ctx.user.appId, ctx.params.roleId)
}

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  let { _id, name, inherits, permissionId } = ctx.request.body
  if (!_id) {
    _id = generateRoleID()
  }
  const role = new Role(_id, name)
    .addPermission(permissionId)
    .addInheritance(inherits)
  if (ctx.request.body._rev) {
    role._rev = ctx.request.body._rev
  }
  const result = await db.put(role)
  await updateRolesOnUserTable(db, _id, UpdateRolesOptions.CREATED)
  role._rev = result.rev
  ctx.body = role
  ctx.message = `Role '${role.name}' created successfully.`
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const roleId = ctx.params.roleId
  // first check no users actively attached to role
  const users = (
    await db.allDocs(
      getUserParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)
  const usersWithRole = users.filter(user => user.roleId === roleId)
  if (usersWithRole.length !== 0) {
    ctx.throw("Cannot delete role when it is in use.")
  }

  await db.remove(roleId, ctx.params.rev)
  await updateRolesOnUserTable(
    db,
    ctx.params.roleId,
    UpdateRolesOptions.REMOVED
  )
  ctx.message = `Role ${ctx.params.roleId} deleted successfully`
  ctx.status = 200
}
