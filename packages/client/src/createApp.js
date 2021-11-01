import { writable } from "svelte/store"
import { createCoreApi } from "./core"
import { attachChildren } from "./render/attachChildren"
import { createTreeNode } from "./render/prepareRenderComponent"
import { screenRouter } from "./render/screenRouter"
import { createStateManager } from "./state/stateManager"

export const createApp = (
  componentLibraries,
  frontendDefinition,
  backendDefinition,
  user,
  uiFunctions,
  window
) => {
  const coreApi = createCoreApi(backendDefinition, user)
  backendDefinition.hierarchy = coreApi.templateApi.constructHierarchy(
    backendDefinition.hierarchy
  )

  let routeTo
  let currentUrl
  let screenStateManager

  const onScreenSlotRendered = screenSlotNode => {
    const onScreenSelected = (screen, store, url) => {
      const stateManager = createStateManager({
        store,
        coreApi,
        frontendDefinition,
        componentLibraries,
        uiFunctions,
        onScreenSlotRendered: () => {},
      })
      const getAttchChildrenParams = attachChildrenParams(stateManager)
      screenSlotNode.props._children = [screen.props]
      const initialiseChildParams = getAttchChildrenParams(screenSlotNode)
      attachChildren(initialiseChildParams)(screenSlotNode.rootElement, {
        hydrate: true,
        force: true,
      })
      if (screenStateManager) screenStateManager.destroy()
      screenStateManager = stateManager
      currentUrl = url
    }

    routeTo = screenRouter(frontendDefinition.screens, onScreenSelected)
    routeTo(currentUrl || window.location.pathname)
  }

  const attachChildrenParams = stateManager => {
    const getInitialiseParams = treeNode => ({
      componentLibraries,
      uiFunctions,
      treeNode,
      onScreenSlotRendered,
      setupState: stateManager.setup,
      getCurrentState: stateManager.getCurrentState,
    })

    return getInitialiseParams
  }

  let rootTreeNode
  const pageStateManager = createStateManager({
    store: writable({ _bbuser: user }),
    coreApi,
    frontendDefinition,
    componentLibraries,
    uiFunctions,
    onScreenSlotRendered,
  })

  const initialisePage = (page, target, urlPath) => {
    currentUrl = urlPath

    rootTreeNode = createTreeNode()
    rootTreeNode.props = {
      _children: [page.props],
    }
    rootTreeNode.rootElement = target
    const getInitialiseParams = attachChildrenParams(pageStateManager)
    const initChildParams = getInitialiseParams(rootTreeNode)

    attachChildren(initChildParams)(target, {
      hydrate: true,
      force: true,
    })

    return rootTreeNode
  }
  return {
    initialisePage,
    screenStore: () => screenStateManager.store,
    pageStore: () => pageStateManager.store,
    routeTo: () => routeTo,
    rootNode: () => rootTreeNode,
  }
}
