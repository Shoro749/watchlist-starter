import { getShow, notes, saveNote } from './state.js';

let opener = null;
let activeId = null;

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
  const form = document.querySelector('#note-form');
  const rating = form.elements.namedItem('rating');
  const note = form.elements.namedItem('note');
  const parsed = new DOMParser().parseFromString(show.summary, 'text/html');
  const saved = notes.get(id);

  activeId = id;
  title.textContent = show.name;
  summary.textContent = parsed.body.textContent.trim();
  link.href = show.url;
  rating.value = saved?.rating ?? '';
  note.value = saved?.text ?? '';
  clearRatingError(rating);
  opener = document.activeElement;
  dialog.showModal();
  rating.focus();
}

function clearRatingError(rating) {
  const error = document.querySelector('#note-rating-error');
  rating.removeAttribute('aria-invalid');
  rating.removeAttribute('aria-describedby');
  error.textContent = '';
}

function showRatingError(rating, message) {
  const error = document.querySelector('#note-rating-error');
  error.textContent = message;
  rating.setAttribute('aria-invalid', 'true');
  rating.setAttribute('aria-describedby', error.id);
  rating.focus();
}

/**
 * C4. Підключає діалог #details: закриття й форму «Моя оцінка й нотатка». main.js викликає цю
 * функцію один раз. Специфікація — ТЗ, C4.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initDetails(refresh) {
  const dialog = document.querySelector('#details');
  const form = dialog.querySelector('#note-form');
  const rating = form.elements.namedItem('rating');
  const cancel = dialog.querySelector('.note-form__actions button[type="button"]');

  form.noValidate = true;
  rating.addEventListener('input', () => clearRatingError(rating));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = rating.value.trim();
    const parsedRating = Number(value);
    if (!value || !Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 10) {
      showRatingError(rating, 'Введіть ціле число від 1 до 10.');
      return;
    }

    saveNote(activeId, {
      rating: parsedRating,
      text: form.elements.namedItem('note').value,
    });
    const savedId = activeId;
    refresh();
    dialog.close();
    document.querySelector(`li[data-id="${savedId}"] [data-action="details"]`)?.focus();
    document.querySelector('#status').textContent = `Нотатку до ${getShow(savedId).name} збережено`;
  });

  cancel.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    opener = null;
    activeId = null;
  });
}
