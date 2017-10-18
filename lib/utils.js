module.exports = {
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
