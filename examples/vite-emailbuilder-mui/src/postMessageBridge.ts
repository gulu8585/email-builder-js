/**
 * postMessageBridge.ts
 *
 * Wires the editor's Zustand store to the parent Rails app via postMessage.
 *
 * Parent → iframe:
 *   { type: 'setDocument', document: {...} }              — load a document
 *   { type: 'getDocument' }                               — request current document
 *   { type: 'setTemplates', templates: [{name, document}] } — replace templates list
 *
 * iframe → parent:
 *   { type: 'editorReady' }                               — editor has mounted
 *   { type: 'documentChanged', document: {...} }          — document updated or in response to getDocument
 */

import { renderToStaticMarkup } from '@usewaypoint/email-builder';

import { editorStateStore, resetDocument } from './documents/editor/EditorContext';

export type AccountTemplate = { name: string; document: unknown };
let accountTemplates: AccountTemplate[] = [];
const templateSubscribers: Array<(t: AccountTemplate[]) => void> = [];

export function getAccountTemplates(): AccountTemplate[] {
  return accountTemplates;
}

export function subscribeToTemplates(cb: (t: AccountTemplate[]) => void): () => void {
  templateSubscribers.push(cb);
  return () => {
    const i = templateSubscribers.indexOf(cb);
    if (i >= 0) templateSubscribers.splice(i, 1);
  };
}

const ALLOWED_ORIGINS = [
  window.location.origin,
  'http://localhost:3000',
  'http://lvh.me:3000',
];

function isAllowedOrigin(origin: string) {
  return ALLOWED_ORIGINS.some((o) => origin.startsWith(o));
}

function postToParent(message: object) {
  window.parent.postMessage(message, '*');
}

export function initPostMessageBridge() {
  // Notify parent that the editor is ready
  postToParent({ type: 'editorReady' });

  // Listen for messages from the parent
  window.addEventListener('message', (event: MessageEvent) => {
    if (!isAllowedOrigin(event.origin)) return;

    const { type, document } = event.data ?? {};

    if (type === 'setDocument') {
      if (document) {
        resetDocument(document);
      }
      // Respond with current doc so parent can confirm
      const current = editorStateStore.getState().document;
      postToParent({ type: 'documentChanged', document: current });
    }

    if (type === 'getDocument') {
      const current = editorStateStore.getState().document;
      const html = renderToStaticMarkup(current, { rootBlockId: 'root' });
      postToParent({ type: 'documentChanged', document: current, html });
    }

    if (type === 'setTemplates' && Array.isArray(event.data.templates)) {
      accountTemplates = event.data.templates as AccountTemplate[];
      templateSubscribers.forEach((cb) => cb(accountTemplates));
    }

    if (type === 'insertToken' && typeof event.data.token === 'string') {
      const token: string = event.data.token;
      const activeEl = document.activeElement as HTMLTextAreaElement | HTMLInputElement | null;
      if (activeEl && (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT')) {
        const start = activeEl.selectionStart ?? activeEl.value.length;
        const end = activeEl.selectionEnd ?? activeEl.value.length;
        activeEl.value = activeEl.value.substring(0, start) + token + activeEl.value.substring(end);
        activeEl.setSelectionRange(start + token.length, start + token.length);
        activeEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });

  // Emit documentChanged whenever the store updates
  editorStateStore.subscribe((state, prev) => {
    if (state.document !== prev.document) {
      postToParent({ type: 'documentChanged', document: state.document });
    }
  });
}
