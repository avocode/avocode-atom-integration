'use babel';

import path from 'path'
import CodeProvider from './code-provider'
import { isInspectorUri, getRevisionIdFromUri, codeToArray } from './utils'

export default class AvocodeView {

  constructor(serializedState) {
    this.currentSelectedStyle = ''
    this.provider = new CodeProvider()

    this.addAvocodeWebViewListeners(this.createAvocodeWebView())
  }

  createAvocodeWebView() {
    this.element = document.createElement('div');
    this.element.classList.add('avocode', 'native-key-bindings');

    const webView = document.createElement('webview');
    webView.setAttribute('src', 'https://app.avocode.com/?utm_source=atom&utm_medium=integration&utm_campaign=avocode-embeded-in-atom')
    webView.setAttribute('style', 'border: 0; width: 100%; height: 100%')
    webView.setAttribute('preload', path.resolve(__dirname, 'avocode-sniffer.js'))

    this.element.appendChild(webView)

    return webView
  }

  addAvocodeWebViewListeners(webView) {
    webView.addEventListener('dom-ready', () => {
      webView.setZoomFactor(0.8)
    })

    // NOTE: Here we receive selected layer style
    webView.addEventListener('ipc-message', (event) => {
      this.currentSelectedStyle = event.channel

      const codeArray = codeToArray(event.channel)
      this.provider.setSuggestions(codeArray)
    })

    webView.addEventListener('did-navigate-in-page', () => {
      const currentUri = webView.getURL()
      if (isInspectorUri(currentUri)) {
        webView.send('avocode:inspector-open', `${getRevisionIdFromUri(currentUri)}`)
      }
    })
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getTitle() {
    return 'Avocode app'
  }

  getElement() {
    return this.element;
  }

  pasteSelectedStyle() {
    return this.currentSelectedStyle || null
  }

  getProvider() {
    return this.provider
  }

}
