import { buildRoundResult, createRoundDeck, scoreGuess, summarizeRecentRounds } from './game-logic.js';
import { readBestScore, saveBestScore } from './local-score.js';
import { CATEGORY_LABELS } from './ocean-items.js';

const gameView = document.querySelector('#game-view');
const resultsView = document.querySelector('#results-view');
const navLinks = [...document.querySelectorAll('.preview-nav__link')];

const state = {
  deck: createRoundDeck(),
  currentIndex: 0,
  score: 0,
  correctAnswers: 0,
  recentRounds: [],
  bestScore: readBestScore(),
  storageAvailable: true,
  guesses: {}
};

const itemIcons = {
  'sea-otter': '<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 13c3-4 7-6 12-5l6 3-5 2-2 4-3-3H7l-4-1Z"/><circle cx="16" cy="10" r=".7"/></svg>',
  coral: '<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V9l4-5 4 5v11"/><path d="M12 20V7l4-3 4 3v13"/><path d="M7 12h3M15 11h2M15 15h2"/></svg>',
  'plastic-bottle': '<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6v3l2 2v12H7V8l2-2V3Z"/><path d="M8 10h8M10 3v3h4V3"/></svg>',
  'lost-fishing-line': '<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5c5 0 5 14 10 14s5-14 6-14"/><path d="M3 7l2-2 2 2M17 17l2 2 2-2"/></svg>',
  'green-sea-turtle': '<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 4 7l2 11 6 3 6-3 2-11-8-4Z"/><path d="m4 7 8 4 8-4M12 11v10"/></svg>',
  jellyfish: '<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c-3 4-6 7-6 11a6 6 0 0 0 12 0c0-4-3-7-6-11Z"/><path d="M9 14c0 2 1 3 3 3"/></svg>',
  'disposable-cup': '<svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 9h14l-1 11H6L5 9Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></svg>'
};

function renderNav() {
  const hash = window.location.hash || '#game';
  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === hash;
    link.classList.toggle('preview-nav__link--active', active);
  });

  gameView.classList.toggle('is-active', hash === '#game' || hash === '');
  resultsView.classList.toggle('is-active', hash === '#results');
}

function createItemCard(item, index) {
  const guess = state.guesses[item.id];
  const badgeClass = guess
    ? guess.correct
      ? 'preview-badge--success'
      : 'preview-badge--danger'
    : 'preview-badge--warning';
  const badgeLabel = guess ? (guess.correct ? 'Correct' : 'Try again') : 'To sort';
  const body = `${CATEGORY_LABELS[item.category]} · ${item.guidance}`;

  return `
    <article class="preview-card" data-item-id="${item.id}">
      <div class="preview-card__media">${itemIcons[item.id] || itemIcons['sea-otter']}</div>
      <div class="preview-card__content">
        <div class="preview-card__title-row">
          <h3 class="preview-card__title">${item.name}</h3>
          <span class="preview-badge ${badgeClass}">
            ${guess && guess.correct ? '<span class="preview-badge__dot"></span>' : ''}
            ${badgeLabel}
          </span>
        </div>
        <p class="preview-card__body">${body}</p>
      </div>
    </article>
  `;
}

function pickRoundNote(correct, score) {
  if (correct === 6) {
    return 'Perfect tide: all six items sorted correctly.';
  }
  if (correct >= 4 || score >= 240) {
    return 'Every careful choice helps protect ocean life.';
  }
  if (correct >= 2) {
    return 'Keep wildlife at a respectful distance.';
  }
  return 'A little more care helps the ocean thrive.';
}

function renderGame() {
  if (state.currentIndex >= state.deck.length) {
    finishRound();
    return;
  }

  const currentItem = state.deck[state.currentIndex];
  const progressText = `${state.currentIndex} of ${state.deck.length} sorted · ${state.score} pts`;
  const itemCards = state.deck.map((item, index) => createItemCard(item, index)).join('');

  gameView.innerHTML = `
    <section class="preview-hero">
      <span class="preview-hero__mesh" aria-hidden="true"></span>
      <span class="preview-hero__eyebrow">A little care makes a big difference</span>
      <h1 class="preview-hero__title">Help keep the ocean thriving</h1>
      <p class="preview-hero__subtitle">Sort wildlife and ocean litter into the right groups. Learn a safe, simple way to help marine life with every choice.</p>
      <div class="preview-hero__actions">
        <button class="preview-btn preview-btn--primary" type="button" data-reset="true">Continue round</button>
        <button class="preview-btn preview-btn--secondary" type="button" data-reset="true">Restart round</button>
      </div>
    </section>

    <div class="preview-section-title">
      <h2 class="preview-section-title__h">Round in progress</h2>
      <span class="preview-section-title__hint">${progressText}</span>
    </div>

    <p class="preview-card__body">Choose the best category for each item. Wildlife belongs in <strong>Marine life</strong>; human-made debris belongs in <strong>Ocean litter</strong>.</p>

    <div class="preview-card-list">
      ${itemCards}
    </div>

    <div class="preview-card-grid">
      <button class="preview-category-choice" type="button" data-category="marine-life">
        <div class="preview-card__media">${itemIcons['green-sea-turtle']}</div>
        <div>
          <h3 class="preview-card__title">Marine life</h3>
          <p class="preview-card__body">Identify and protect animals and living habitats.</p>
        </div>
      </button>
      <button class="preview-category-choice" type="button" data-category="ocean-litter">
        <div class="preview-card__media">${itemIcons['disposable-cup']}</div>
        <div>
          <h3 class="preview-card__title">Ocean litter</h3>
          <p class="preview-card__body">Human-made debris: remove it only when safe, or report it.</p>
        </div>
      </button>
    </div>

    <div class="preview-action-bar">
      <span class="preview-card__meta">Keyboard: use Tab and Enter · Touch: tap a category</span>
    </div>

    <div id="feedback-panel" class="preview-error" style="display:none;" aria-live="polite"></div>
  `;

  bindGameControls(currentItem);
}

function bindGameControls(currentItem) {
  const categoryButtons = document.querySelectorAll('[data-category]');
  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      handleGuess(currentItem, button.dataset.category);
    });
  });

  const resetButtons = document.querySelectorAll('[data-reset="true"]');
  resetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      resetRound();
    });
  });
}

function handleGuess(item, category) {
  const result = scoreGuess(item, category);
  const feedbackPanel = document.querySelector('#feedback-panel');

  if (result.correct) {
    state.score += result.points;
    state.correctAnswers += 1;
  }

  state.guesses[item.id] = { correct: result.correct, category };
  feedbackPanel.style.display = 'flex';
  feedbackPanel.innerHTML = `
    <span class="preview-error__icon">
      <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4"/><path d="M12 17h.01"/>
      </svg>
    </span>
    <div class="preview-error__body">
      <span class="preview-error__title">${result.correct ? 'Correct' : 'Not quite'}</span>
      <span class="preview-error__text">${result.feedback}</span>
    </div>
    <button class="preview-btn preview-btn--secondary preview-error__action" type="button">Retry</button>
  `;

  const retryBtn = feedbackPanel.querySelector('.preview-error__action');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      feedbackPanel.style.display = 'none';
      renderGame();
    });
  }

  window.setTimeout(() => {
    state.currentIndex += 1;
    renderGame();
  }, 850);
}

function finishRound() {
  const roundResult = buildRoundResult({
    correct: state.correctAnswers,
    total: state.deck.length,
    score: state.score,
    note: pickRoundNote(state.correctAnswers, state.score)
  });

  state.recentRounds.unshift(roundResult);
  state.bestScore = Math.max(state.bestScore, roundResult.score);
  state.storageAvailable = saveBestScore(state.bestScore);

  renderResults();
  window.location.hash = '#results';
}

function renderResults() {
  const summary = summarizeRecentRounds(state.recentRounds, state.bestScore);
  const rows = summary.recent.length
    ? summary.recent
        .map(
          (round) => `
            <tr>
              <td>${round.correct} of ${round.total}</td>
              <td>${round.score} pts</td>
              <td>${round.accuracy}</td>
              <td>${round.note}</td>
            </tr>
          `
        )
        .join('')
    : `
      <tr>
        <td colspan="4">No rounds yet</td>
      </tr>
    `;

  resultsView.innerHTML = `
    <div class="preview-section-title">
      <h1 class="preview-section-title__h">Round Results</h1>
      <span class="preview-section-title__hint">Best round · ${summary.bestScore} pts</span>
    </div>

    <div class="preview-error" style="display:${state.storageAvailable ? 'none' : 'flex'};" role="alert">
      <span class="preview-error__icon">
        <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v5"/><path d="M12 18h.01"/>
        </svg>
      </span>
      <div class="preview-error__body">
        <span class="preview-error__title">Personal best could not be saved</span>
        <span class="preview-error__text">This browser is blocking local storage. You can still play; retry to save your best score on this device.</span>
      </div>
      <button class="preview-btn preview-btn--secondary preview-error__action" type="button">Retry</button>
    </div>

    <div class="preview-tabs" aria-label="Result views">
      <div class="preview-tabs__tab preview-tabs__tab--active">Recent rounds</div>
      <div class="preview-tabs__tab">First round</div>
    </div>

    <div class="preview-table-wrap">
      <table class="preview-table">
        <thead>
          <tr>
            <th scope="col">Round</th>
            <th scope="col">Correct</th>
            <th scope="col">Score</th>
            <th scope="col">Marine-life takeaway</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    ${summary.recent.length ? '' : `
      <section class="preview-empty" aria-label="First-play state">
        <span class="preview-empty__icon">
          <svg viewBox="0 0 24 24" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 13h4l2 3h4l2-3h4"/><path d="M5 6h14l1 7v5H4v-5Z"/>
          </svg>
        </span>
        <h2 class="preview-empty__title">Your first round is waiting</h2>
        <p class="preview-empty__body">After your first game, this space will show your local score history and personal best.</p>
        <button class="preview-btn preview-btn--primary" type="button" data-return-game="true">Play your first round</button>
      </section>
    `}

    <div class="preview-action-bar">
      <span class="preview-card__meta">Best score is stored only in this browser.</span>
      <button class="preview-btn preview-btn--primary" type="button" data-return-game="true">Play another round</button>
    </div>
  `;

  const returnGameButtons = resultsView.querySelectorAll('[data-return-game="true"]');
  returnGameButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.deck = createRoundDeck();
      state.currentIndex = 0;
      state.score = 0;
      state.correctAnswers = 0;
      state.guesses = {};
      renderGame();
      window.location.hash = '#game';
      renderNav();
    });
  });

  const retryButton = resultsView.querySelector('.preview-error__action');
  if (retryButton) {
    retryButton.addEventListener('click', () => {
      const saved = saveBestScore(state.bestScore);
      state.storageAvailable = saved;
      renderResults();
    });
  }
}

function resetRound() {
  state.deck = createRoundDeck();
  state.currentIndex = 0;
  state.score = 0;
  state.correctAnswers = 0;
  state.guesses = {};
  renderGame();
}

function init() {
  const hash = window.location.hash || '#game';
  if (hash === '#results') {
    renderResults();
  } else {
    renderGame();
  }

  renderNav();

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const nextHash = link.getAttribute('href');
      if (nextHash === '#results') {
        renderResults();
      } else {
        resetRound();
      }
      window.location.hash = nextHash;
      renderNav();
    });
  });

  window.addEventListener('hashchange', () => {
    renderNav();
    if (window.location.hash === '#results') {
      renderResults();
    } else {
      resetRound();
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  init();
});
