import { CATEGORY_LABELS } from './ocean-items.js';

export function createRoundDeck() {
  return [
    { id: 'sea-otter', name: 'Sea otter', category: 'marine-life', guidance: 'Observe quietly; never feed wild otters.' },
    { id: 'coral', name: 'Coral', category: 'marine-life', guidance: 'Look closely, but do not touch or stand on coral.' },
    { id: 'green-sea-turtle', name: 'Green sea turtle', category: 'marine-life', guidance: 'Give nesting turtles and hatchlings plenty of space.' },
    { id: 'plastic-bottle', name: 'Plastic bottle', category: 'ocean-litter', guidance: 'Remove it only when it is safe to do so.' },
    { id: 'lost-fishing-line', name: 'Lost fishing line', category: 'ocean-litter', guidance: 'Keep clear and report it to a trained responder.' },
    { id: 'disposable-cup', name: 'Disposable cup', category: 'ocean-litter', guidance: 'Pick it up only when it is safe to do so.' }
  ];
}

export function scoreGuess(item, selectedCategory) {
  const correct = item.category === selectedCategory;

  if (correct) {
    return {
      correct: true,
      points: 60,
      feedback: `Correct! ${item.name} belongs in ${CATEGORY_LABELS[item.category]}.`,
      guidance: item.guidance
    };
  }

  return {
    correct: false,
    points: 0,
    feedback: `Not quite. ${item.name} belongs in ${CATEGORY_LABELS[item.category]}.`,
    guidance: item.guidance
  };
}

export function buildRoundResult({ correct, total, score, note }) {
  const accuracy = `${Math.round((correct / total) * 100)}%`;

  return {
    correct,
    total,
    score,
    accuracy,
    note
  };
}

export function summarizeRecentRounds(rounds, bestScore) {
  const recent = rounds.map((round) => buildRoundResult(round));

  if (!recent.length) {
    return {
      bestScore: bestScore || 0,
      recent: [],
      message: 'Start a round to create your first result.',
      bestRound: null
    };
  }

  const highest = Math.max(bestScore, ...recent.map((round) => round.score));
  const bestRound = recent.reduce((winner, current) => (current.score > winner.score ? current : winner), recent[0]);

  return {
    bestScore: highest,
    recent,
    message: bestRound.note,
    bestRound
  };
}
