import { openDetails } from './details.js';
import { toggle, watchlist } from './state.js';

/**
 * C2. Підключає кнопки карток у списку #results: «До списку» додає серіал до мого списку або
 * прибирає з нього, «Детальніше» відкриває діалог (openDetails з details.js). main.js викликає
 * цю функцію один раз, після першого показу списку. Специфікація — ТЗ, C2.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initList(refresh) {
  const results = document.querySelector('#results');
  const count = document.querySelector('#watchlist-count');

  results.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    const card = button?.closest('li[data-id]');
    if (!button || !card) return;

    const id = Number(card.dataset.id);
    if (button.dataset.action === 'details') {
      openDetails(id);
      return;
    }

    if (button.dataset.action === 'toggle') {
      toggle(id);
      count.textContent = String(watchlist.size);
      refresh();
      const nextButton = document.querySelector(`li[data-id="${id}"] [data-action="toggle"]`);
      nextButton?.focus();
    }
  });
}
