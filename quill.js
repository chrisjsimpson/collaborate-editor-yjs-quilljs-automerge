/* eslint-env browser */
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { QuillBinding } from 'y-quill'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import QuillMarkdown from 'quilljs-markdown'

Quill.register('modules/cursors', QuillCursors)
Quill.register('modules/QuillMarkdown', QuillMarkdown, true)

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
      QuillMarkdown: {},
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'link', 'list'],
        ['image', 'code-block', 'video']
      ],
      history: {
        userOnly: true
      }
    },
    placeholder: 'Start collaborating...',
    theme: 'bubble' // or 'snow'
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

  function openDocument() {
    documentNameSpanElm.textContent = documentName;
    const newFileName = document.getElementById('newFileName').value.toLocaleLowerCase();

    if (newFileName.trim() != "") {
      localStorage.setItem('document-name', newFileName);
      // Reload with difference filename which may or may not already exist, and that's OK
      // If it already exists, then the previous document will load (if connected to the
      // internet) otherwise, a blank document will show.
      window.history.replaceState(null, null, "?doc=" + newFileName);
      document.location.reload();
    }
  }

  // Create new document
  const newDocumentElm = document.getElementById('newDocument').addEventListener('click', () => {
    openDocument();
  })
  const newDocumentFormElm = document.getElementById("newDocumentForm").addEventListener('submit', (e) => {
    e.preventDefault();
    openDocument();
  });
})
