module.exports = {
  getReactInstanceFromNode: (node) => {
    for (var key in node) {
        if (key.startsWith("__reactInternalInstance$")) {
            var compInternals = node[key]._currentElement;
            var compWrapper = compInternals._owner;
            var comp = compWrapper._instance;
            return comp;
        }
    }
    return null;
  },
  isInspectorUri: (uri) => {
    const regex = /\/revisions\/[0-9]+\/\?design=[0-9]+/
    return regex.test(uri)
  },
  getRevisionIdFromUri: (uri) => {
    return uri.replace('https://app.avocode.com/revisions/', '').split('/').shift()
  },
  codeToArray: (code = '') => {
    let arr = code.split('\n').map(line => line.trim())
    return arr
  },
}
