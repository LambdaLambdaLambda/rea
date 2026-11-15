import { describe, expect, it } from 'vitest';
import {
  buildRoundResult,
  createRoundDeck,
  scoreGuess,
  summarizeRecentRounds,
} from '../src/game-logic.js';

describe('ocean game logic', () => {
  it('scores a correct guess and gives marine guidance for the item', () => {
    const item = { id: 'sea-otter', name: 'Sea otter', category: 'marine-life', guidance: 'Observe quietly; never feed wild otters.' };

    expect(scoreGuess(item, 'marine-life')).toEqual({
      correct: true,
      points: 60,
      feedback: 'Correct! Sea otter belongs in Marine life.',
      guidance: 'Observe quietly; never feed wild otters.'
    });
  });

  it('creates a six-item deck with a mix of wildlife and litter', () => {
    const deck = createRoundDeck();

    expect(deck).toHaveLength(6);
    expect(deck.filter((item) => item.category === 'marine-life')).toHaveLength(3);
    expect(deck.filter((item) => item.category === 'ocean-litter')).toHaveLength(3);
  });

  it('builds a summary with a personal best and a helpful message', () => {
    const rounds = [
      { id: 'r1', correct: 4, total: 6, score: 240, note: 'Every careful choice helps protect ocean life.' },
      { id: 'r2', correct: 5, total: 6, score: 300, note: 'Keep wildlife at a respectful distance.' },
      { id: 'r3', correct: 6, total: 6, score: 360, note: 'Perfect tide: all six items sorted correctly.' }
    ];

    const summary = summarizeRecentRounds(rounds, 360);

    expect(summary.bestScore).toBe(360);
    expect(summary.recent).toHaveLength(3);
    expect(summary.message).toContain('Perfect tide');
  });

  it('builds a round result with the correct total and accuracy', () => {
    const result = buildRoundResult({
      correct: 4,
      total: 6,
      score: 240,
      note: 'Every careful choice helps protect ocean life.'
    });

    expect(result.correct).toBe(4);
    expect(result.total).toBe(6);
    expect(result.score).toBe(240);
    expect(result.accuracy).toBe('67%');
  });
});
