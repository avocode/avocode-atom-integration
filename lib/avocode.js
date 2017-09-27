'use babel';

import AvocodeView from './avocode-view';
import { CompositeDisposable } from 'atom';

export default {

  avocodeView: null,
  subscriptions: null,

  activate(state) {
    this.avocodeView = new AvocodeView()

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable(

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'avocode:split-up': () => this.open({ split: 'up' }),
        'avocode:split-down': () => this.open({ split: 'down' }),
        'avocode:split-left': () => this.open({ split: 'left' }),
        'avocode:split-right': () => this.open({ split: 'right' }),
        'avocode:new-tab': () => this.open(),
        'avocode:paste-style': () => this.pasteSelectedStyle(),
      }),

      atom.workspace.addOpener(uri => {
        if (uri === 'avocode://') {
          return this.avocodeView;
        }
      }),
    );
  },

  deactivate() {
    this.subscriptions.dispose()
    this.avocodeView.destroy()

    this.avocodeView = null
    this.subscriptions = null
  },

  serialize() {
    return {
      avocodeViewState: this.avocodeView.serialize()
    };
  },

  open(options = {}) {
    if (!navigator.onLine) {
      atom.notifications.addError('You must be online to use Avocode integration. Please check your connection.')
      return
    }
    atom.workspace.open('avocode://', options)
  },

  pasteSelectedStyle() {
    const style = this.avocodeView.pasteSelectedStyle()
    if (style) {
      const editor = atom.workspace.getActiveTextEditor()
      editor.insertText(style)
    }
  },

  getProvider() {
    return this.avocodeView.getProvider()
  },

};
