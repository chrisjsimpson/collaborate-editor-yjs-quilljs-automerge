/* eslint-env browser */
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { QuillBinding } from 'y-quill'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'

Quill.register('modules/cursors', QuillCursors)

window.addEventListener('load', () => {
  // If ?doc name is set, then try and open that.
  // e.g. example.com?doc=chapter-one
  let searchParams = new URLSearchParams(document.location.search)

  if (searchParams.get("doc")) {
    var documentName = searchParams.get("doc");
    localStorage.setItem('document-name', documentName);
  }

  if (localStorage.getItem("document-name") === null) {
    var documentName = 'quill-demo-1';
  } else {
    var documentName = localStorage.getItem("document-name");
  }
  // Set browser tab title
  document.title = documentName;

  const ydoc = new Y.Doc()
  const provider = new WebsocketProvider('ws://127.0.0.1:1234', documentName, ydoc)
  const ytext = ydoc.getText('quill')
  const editorContainer = document.createElement('div')
  editorContainer.setAttribute('id', 'editor')
  document.body.insertBefore(editorContainer, null)

  const editor = new Quill(editorContainer, {
    modules: {
      cursors: true,
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'link'],
        ['image', 'code-block']
      ],
      history: {
        userOnly: true
      }
    },
    placeholder: 'Start collaborating...',
    theme: 'snow' // or 'bubble'
  })

  const binding = new QuillBinding(ytext, editor, provider.awareness)

  /*
  // Define user name and user name
  // Check the quill-cursors package on how to change the way cursors are rendered
  provider.awareness.setLocalStateField('user', {
    name: 'Typing Jimmy',
    color: 'blue'
  })
  */

  const connectBtn = document.getElementById('y-connect-btn')
  connectBtn.addEventListener('click', () => {
    if (provider.shouldConnect) {
      provider.disconnect()
      connectBtn.textContent = 'Connect'
    } else {
      provider.connect()
      connectBtn.textContent = 'Disconnect'
    }
  })

  // @ts-ignore
  window.example = { provider, ydoc, ytext, binding, Y }

  const documentNameSpanElm = document.getElementById('documentName');
  documentNameSpanElm.textContent = documentName;

  // Create new document
  const newDocumentElm = document.getElementById('newDocument').addEventListener('click', () => {
    const newFileName = document.getElementById('newFileName').value;

    if (newFileName.trim() != "") {
      localStorage.setItem('document-name', newFileName);
      // Reload with difference filename which may or may not already exist, and that's OK
      // If it already exists, then the previous document will load (if connected to the
      // internet) otherwise, a blank document will show.
      document.location.reload();
    }
  })
})
