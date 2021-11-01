export const renderComponent = ({
  componentConstructor,
  uiFunctions,
  htmlElement,
  anchor,
  props,
  initialProps,
  bb,
  parentNode,
}) => {
  const func = initialProps._id ? uiFunctions[initialProps._id] : undefined

  const parentContext = (parentNode && parentNode.context) || {}

  let renderedNodes = []
  const render = context => {
    let componentContext = parentContext
    if (context) {
      componentContext = { ...componentContext }
      componentContext.$parent = parentContext
    }

    const thisNode = createTreeNode()
    thisNode.context = componentContext
    thisNode.parentNode = parentNode
    thisNode.props = props

    parentNode.children.push(thisNode)
    renderedNodes.push(thisNode)

    initialProps._bb = bb(thisNode, props)

    thisNode.component = new componentConstructor({
      target: htmlElement,
      props: initialProps,
      hydrate: false,
      anchor,
    })

    thisNode.rootElement = htmlElement.children[htmlElement.children.length - 1]

    if (initialProps._id && thisNode.rootElement) {
      thisNode.rootElement.classList.add(`pos-${initialProps._id}`)
    }
  }

  if (func) {
    func(render, parentContext)
  } else {
    render()
  }

  return renderedNodes
}

export const createTreeNode = () => ({
  context: {},
  props: {},
  rootElement: null,
  parentNode: null,
  children: [],
  component: null,
  unsubscribe: () => {},
  get destroy() {
    const node = this
    return () => {
      if (node.unsubscribe) node.unsubscribe()
      if (node.component && node.component.$destroy) node.component.$destroy()
      if (node.children) {
        for (let child of node.children) {
          child.destroy()
        }
      }
    }
  },
})
