/** @typedef {import('./state.js').Show} Show */
import { notes, shows, watchlist } from './state.js';

/**
 * C1. Показує серіали в списку #results — по картці з шаблону #show-card на кожен, у тому
 * самому порядку, — і оновлює рядок статусу #status. Специфікація — ТЗ, C1.
 *
 * @param {readonly Show[]} list серіали, які треба показати
 */
export function renderShows(list) {
  const results = document.querySelector('#results');
  const template = document.querySelector('#show-card');
  const status = document.querySelector('#status');
  const fragment = document.createDocumentFragment();

  for (const show of list) {
    const card = /** @type {HTMLElement} */ (template.content.cloneNode(true).firstElementChild);
    card.dataset.id = String(show.id);

    for (const field of card.querySelectorAll('[data-field]')) {
      const name = field.dataset.field;
      const value =
        name === 'genres'
          ? show.genres.length ? show.genres.join(', ') : '—'
          : show[name] ?? '—';
      field.textContent = String(value);
    }

    card.querySelector('[data-action="toggle"]')?.setAttribute('aria-pressed', String(watchlist.has(show.id)));

    const saved = notes.get(show.id);
    const mine = card.querySelector('.card__mine');
    const note = card.querySelector('.card__note');
    if (saved) {
      card.querySelector('[data-field="my-rating"]').textContent = String(saved.rating);
      mine.hidden = false;
      note.textContent = saved.text;
      note.hidden = !saved.text;
    }

    fragment.append(card);
  }

  results.replaceChildren(fragment);
  status.textContent = list.length ? `Знайдено: ${list.length} з ${shows.length}` : 'Нічого не знайдено';
}
