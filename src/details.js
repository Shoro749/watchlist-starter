import { getShow } from './state.js';

let opener = null;

/**
 * C4. Відкриває діалог #details для серіалу: назва, опис, посилання на сторінку TVmaze і форма
 * з моєю оцінкою й нотаткою. Специфікація — ТЗ, C4.
 *
 * @param {number} id
 */
export function openDetails(id) {
  const show = getShow(id);
  const dialog = document.querySelector('#details');
  const title = document.querySelector('#details-title');
  const summary = document.querySelector('#details-summary');
  const link = document.querySelector('#details-link');
  const parsed = new DOMParser().parseFromString(show.summary, 'text/html');

  title.textContent = show.name;
  summary.textContent = parsed.body.textContent.trim();
  link.href = show.url;
  opener = document.activeElement;
  dialog.showModal();
  title.focus();
}

/**
 * C4. Підключає діалог #details: закриття й форму «Моя оцінка й нотатка». main.js викликає цю
 * функцію один раз. Специфікація — ТЗ, C4.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initDetails(refresh) {
  const dialog = document.querySelector('#details');
  const cancel = dialog.querySelector('.note-form__actions button[type="button"]');

  cancel.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    opener = null;
  });
}
