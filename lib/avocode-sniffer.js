const { ipcRenderer } = require('electron')
const { getReactInstanceFromNode } = require('./utils')

let state = {
  isSelectionStoreEventListenerRegistered: false,
}

const setState = (newState = {}) => {
  state = Object.assign({}, state, newState)
}

const getAvocodeInstances = () => {
  return avocode._injector._instances
}

// NOTE: Still method is a dirty hack. At least 2 or more kittens died.
const collapsLeftSidebar = () => {
  try {
    const leftSideBarNode = document.querySelector('.sidebar--left > div')
    const instance = getReactInstanceFromNode(leftSideBarNode)
    instance.setState({ activeItemCollapsed: true })
  } catch (e) {}
}

const getCode = (revisionIdString) => {
  const revisionId = Number(revisionIdString)
  const app = getAvocodeInstances()
  const activeDocLayerStore = app.layerStyleStore.getScopedChild(revisionId)
  const unitAwareLayerStyle = activeDocLayerStore.getSelectionUnitAwareLayerStyle()
  const layerStyle = unitAwareLayerStyle ? unitAwareLayerStyle.get('layer_style') : null

  if (!layerStyle) { return '' }

  return app.templateCodeGenerator.generateCode(revisionId, layerStyle)
}

const sendGeneratedCode = (generatedCode) => {
  ipcRenderer.sendToHost(`${generatedCode}`)
}

var handleChange = (revisionIdString) => {
  setState({ isSelectionStoreEventListenerRegistered: true })
  collapsLeftSidebar()

  const generatedCode = getCode(revisionIdString)
  if (generatedCode) { sendGeneratedCode(generatedCode) }
}

ipcRenderer.on('avocode:inspector-open', (event, revisionId) => {
  const app = getAvocodeInstances()
  collapsLeftSidebar()

  if (!state.isSelectionStoreEventListenerRegistered) {
    app.selectionStore.addChangeListener(() => handleChange(revisionId))
    app.templateStore.addChangeListener(() => handleChange(revisionId))
    app.variableStore.addChangeListener(() => handleChange(revisionId))
  }
})
