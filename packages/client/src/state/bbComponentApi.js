// import { getStateOrValue } from "./getState"
import { setState, setStateFromBinding } from "./setState"
import { trimSlash } from "../common/trimSlash"
import { isBound } from "./parseBinding"
import { attachChildren } from "../render/attachChildren"
import { getContext, setContext } from "./getSetContext"

export const bbFactory = ({
  store,
  getCurrentState,
  frontendDefinition,
  componentLibraries,
  onScreenSlotRendered,
}) => {
  const relativeUrl = url => {
    if (!frontendDefinition.appRootPath) return url
    if (
      url.startsWith("http:") ||
      url.startsWith("https:") ||
      url.startsWith("./")
    )
      return url

    return frontendDefinition.appRootPath + "/" + trimSlash(url)
  }

  const apiCall = method => (url, body) =>
    fetch(relativeUrl(url), {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body && JSON.stringify(body),
    })

  const api = {
    post: apiCall("POST"),
    get: apiCall("GET"),
    patch: apiCall("PATCH"),
    delete: apiCall("DELETE"),
  }

  return (treeNode, setupState) => {
    const attachParams = {
      componentLibraries,
      treeNode,
      onScreenSlotRendered,
      setupState,
      getCurrentState,
    }

    return {
      attachChildren: attachChildren(attachParams),
      context: treeNode.context,
      props: treeNode.props,
      call: (event, context) => event(context),
      setStateFromBinding: (binding, value) =>
        setStateFromBinding(store, binding, value),
      setState: (path, value) => setState(store, path, value),
      // getStateOrValue: (prop, currentContext) =>
      //   getStateOrValue(getCurrentState(), prop, currentContext),
      getContext: getContext(treeNode),
      setContext: setContext(treeNode),
      store: store,
      relativeUrl,
      api,
      isBound,
      parent,
    }
  }
}
