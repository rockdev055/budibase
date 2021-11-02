export const USER_STATE_PATH = "_bbuser"

export const authenticate = api => async ({ username, password }) => {
  if (!username) {
    api.error("Authenticate: username not set")
    return
  }

  if (!password) {
    api.error("Authenticate: password not set")
    return
  }

  const user = await api.post({
    url: "/api/authenticate",
    body: { username, password },
  })

  // set user even if error - so it is defined at least
  api.setState(USER_STATE_PATH, user)
  localStorage.setItem("budibase:user", JSON.stringify(user))
}
