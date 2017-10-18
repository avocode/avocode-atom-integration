const { ipcRenderer } = require('electron')

let state = {
  isSelectionStoreEventListenerRegistered: false,
}

const setState = (newState = {}) => {
  state = Object.assign({}, state, newState)
}

const getAvocodeInstances = () => {
  return avocode._injector._instances
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

  const generatedCode = getCode(revisionIdString)
  if (generatedCode) { sendGeneratedCode(generatedCode) }
}

ipcRenderer.on('avocode:inspector-open', (event, revisionId) => {
  const app = getAvocodeInstances()

  if (!state.isSelectionStoreEventListenerRegistered) {
    app.selectionStore.addChangeListener(() => handleChange(revisionId))
    app.templateStore.addChangeListener(() => handleChange(revisionId))
    app.variableStore.addChangeListener(() => handleChange(revisionId))
  }
})
