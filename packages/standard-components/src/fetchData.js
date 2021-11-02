import api from "./api"

export default async function fetchData(datasource, store) {
  const { type, name } = datasource

  if (name) {
    let rows = []
    if (type === "table") {
      rows = fetchTableData()
    } else if (type === "view") {
      rows = fetchViewData()
    } else if (type === "link") {
      rows = fetchLinkedRowsData()
    }

    // Fetch table schema so we can check for linked rows
    if (rows && rows.length) {
      const table = await fetchTable()
      const keys = Object.keys(table.schema)
      rows.forEach(row => {
        for (let key of keys) {
          if (table.schema[key].type === "link") {
            row[`${key}_count`] = Array.isArray(row[key]) ? row[key].length : 0
          }
        }
      })
    }

    return rows
  } else {
    return []
  }

  async function fetchTable() {
    const FETCH_TABLE_URL = `/api/tables/${datasource.tableId}`
    const response = await api.get(FETCH_TABLE_URL)
    return await response.json()
  }

  async function fetchTableData() {
    if (!name.startsWith("all_")) {
      throw new Error("Incorrect table convention - must begin with all_")
    }
    const tablesResponse = await api.get(`/api/views/${name}`)
    return await tablesResponse.json()
  }

  async function fetchViewData() {
    console.log("fetching view")
    const { field, groupBy } = datasource
    const params = new URLSearchParams()

    if (field) {
      params.set("field", field)
      params.set("stats", true)
    }
    if (groupBy) params.set("group", groupBy)

    let QUERY_VIEW_URL = field
      ? `/api/views/${name}?${params}`
      : `/api/views/${name}`

    const response = await api.get(QUERY_VIEW_URL)
    return await response.json()
  }

  async function fetchLinkedRowsData() {
    if (!store || !store.data || !store.data._id) {
      return []
    }
    const QUERY_URL = `/api/${store.data.tableId}/${store.data._id}/enrich`
    const response = await api.get(QUERY_URL)
    const row = await response.json()
    return row[datasource.fieldName]
  }
}
