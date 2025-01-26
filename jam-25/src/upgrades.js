import { v4 } from "uuid";

export const BONUSES = {
  BDL: { price: 3, name: 'Double Letter Space', description: 'Place this upgrade on the board to score double the points for any tile placed on it', text: '2xL', multiplier: 2, adder: 0, placement: 'board', scope: 'letter', style: { backgroundColor: 'rgba(66, 135, 245, 0.4)', border: '4px double rgb(66, 135, 245)' }, threshhold: 1 },
  BTL: { price: 4, name: 'Triple Letter Space', description: 'Place this upgrade on the board to score triple the points for any tile placed on it', text: '3xL', multiplier: 3, adder: 0, placement: 'board', scope: 'letter', style: { backgroundColor: 'rgba(235, 143, 52, 0.4)', border: '4px double rgb(235, 143, 52)' }, threshhold: 2 },
  BDW: { price: 5, name: 'Double Word Space', description: 'Place this upgrade on the board to score double the points for any word played over it', text: '2xW', multiplier: 2, adder: 0, placement: 'board', scope: 'word', style: { backgroundColor: 'rgba(66, 135, 245, 0.6)', border: '4px double rgb(66, 135, 245)' }, threshhold: 3 },
  BTW: { price: 6, name: 'Triple Word Space', description: 'Place this upgrade on the board to score triple the points for any word played over it', text: '3xW', multiplier: 3, adder: 0, placement: 'board', scope: 'word', style: { backgroundColor: 'rgba(235, 143, 52, 0.6)', border: '4px double rgb(235, 143, 52)' }, threshhold: 4 },
  TDL: { price: 4, name: 'Double Letter Tile', description: 'Place this upgrade on a tile to score double the points', text: '2xL', multiplier: 2, adder: 0, placement: 'tile', scope: 'letter', style: { backgroundColor: 'rgba(36, 102, 145, 0.4)', border: '4px double rgb(36, 102, 145)' } },
  TTL: { price: 5, name: 'Triple Letter Tile', description: 'Place this upgrade on a tile to score triple the points', text: '3xL', multiplier: 3, adder: 0, placement: 'tile', scope: 'letter', style: { backgroundColor: 'rgba(138, 97, 32, 0.4)', border: '4px double rgb(138, 97, 32)' } },
  TDW: { price: 6, name: 'Double Word Tile', description: 'Place this upgrade on a tile to score double the points for any word this tile is part of', text: '2xW', multiplier: 2, adder: 0, placement: 'tile', scope: 'word', style: { backgroundColor: 'rgba(46, 184, 181, 0.4)', border: '4px double rgb(46, 184, 181)' } },
  TTW: { price: 7, name: 'Triple Word Tile', description: 'Place this upgrade on a tile to score triple the points for any word this tile is part of', text: '3xW', multiplier: 3, adder: 0, placement: 'tile', scope: 'word', style: { backgroundColor: 'rgba(191, 42, 176, 0.4)', border: '4px double rgb(191, 42, 176)' } },
  EDGE: { price: 10, name: 'Board Edge', description: 'Place this upgrade on the edge of the board give yourself more room to play', text: 'EDGE', placement: 'edge', style: { backgroundColor: 'rgba(102, 105, 112, 0.6)', border: '4px double rgb(102, 105, 112)' } },
  TP1: { price: 3, name: '+1 Letter Tile', description: 'Place this upgrade on a tile to add one point for any word this tile is part of', text: '+1L', multiplier: 0, adder: 1, placement: 'tile', scope: 'letter', style: { backgroundColor: 'rgba(191, 42, 176, 0.4)', border: '4px double rgb(191, 42, 176)' }, threshhold: 4 },
  TP3: { price: 5, name: '+3 Letter Tile', description: 'Place this upgrade on a tile to add three points for any word this tile is part of', text: '+3L', multiplier: 0, adder: 3, placement: 'tile', scope: 'letter', style: { backgroundColor: 'rgba(191, 42, 176, 0.4)', border: '4px double rgb(191, 42, 176)' }, threshhold: 4 },
  TP5: { price: 7, name: '+5 Letter Tile', description: 'Place this upgrade on a tile to add five points for any word this tile is part of', text: '+5L', multiplier: 0, adder: 5, placement: 'tile', scope: 'letter', style: { backgroundColor: 'rgba(191, 42, 176, 0.4)', border: '4px double rgb(191, 42, 176)' }, threshhold: 4 },
  BP1: { price: 4, name: '+1 Letter Space', description: 'Place this upgrade on the board to add one point for any word played over it', text: '+1L', multiplier: 0, adder: 1, placement: 'board', scope: 'letter', style: { backgroundColor: 'rgba(191, 42, 176, 0.4)', border: '4px double rgb(191, 42, 176)' }, threshhold: 4 },
  BP3: { price: 6, name: '+3 Letter Space', description: 'Place this upgrade on the board to add three points for any word played over it', text: '+3L', multiplier: 0, adder: 3, placement: 'board', scope: 'letter', style: { backgroundColor: 'rgba(191, 42, 176, 0.4)', border: '4px double rgb(191, 42, 176)' }, threshhold: 4 },
  BP5: { price: 8, name: '+5 Letter Space', description: 'Place this upgrade on the board to add five points for any word played over it', text: '+5L', multiplier: 0, adder: 5, placement: 'board', scope: 'letter', style: { backgroundColor: 'rgba(191, 42, 176, 0.4)', border: '4px double rgb(191, 42, 176)' }, threshhold: 4 },
};

export const JOKERS = [
  { price: 4, id: v4(), text: '2️⃣', name: 'X 2', description: 'Multiplies the total score by two', action: ({ words, grid, totalScore }) => { return { newScore: totalScore * 2, newMoney: 0 }; }, style: { border: '1px solid goldenrod', backgroundColor: 'gold' } },
  { price: 3, id: v4(), text: '➕', name: '+ 20', description: 'Adds 20 to the total score', action: ({ words, grid, totalScore }) => { return { newScore: totalScore + 20, newMoney: 0 }; }, style: { border: '1px solid crimson', backgroundColor: 'tomato' } },
  { price: 5, id: v4(), text: '❌', name: 'Crosser', description: 'Adds +1 multiplier for every intersection',
    action: ({ words, grid, totalScore }) => {
      const tileCounts = {};
      words.flat().filter((w) => w.valid).forEach((w) => w.tiles?.forEach((t) => tileCounts[t.props?.id] = tileCounts[t.props?.id] ? tileCounts[t.props?.id] += 1 : 1))
      return { newScore: (1 + (Object.keys(tileCounts).filter((k) => tileCounts[k] > 1).length)) * totalScore, newMoney: 0 };
    },
    style: { border: '1px solid crimson', backgroundColor: 'lightsalmon' } },
    { price: 6, id: v4(), text: '💰', name: 'Banker', description: '+$1 for every word',
      action: ({ words, grid, totalScore }) => {
        const wordCount = words[words.length - 1].filter((w) => w.valid).length
        return { newScore: totalScore, newMoney: wordCount * 1 };
      },
      style: { border: '1px solid tan', backgroundColor: 'seashell' } },
];