import { v4 } from "uuid";

export const BONUSES = {
  BDL: { rarity: 0, price: 3, name: 'Double Letter Space', description: 'Doubles the points for any tile placed on it', text: '2xL', multiplier: 2, adder: 0, placement: 'board', scope: 'letter', style: { backgroundColor: 'rgba(33, 115, 191, 0.4)', border: '4px double rgb(33, 115, 191)' }, threshhold: 1 },
  BTL: { rarity: 1, price: 4, name: 'Triple Letter Space', description: 'Triples the points for any tile placed on it', text: '3xL', multiplier: 3, adder: 0, placement: 'board', scope: 'letter', style: { backgroundColor: 'rgba(18, 61, 138, 0.4)', border: '4px double rgb(18, 61, 138)' }, threshhold: 2 },
  BDW: { rarity: 2, price: 5, name: 'Double Word Space', description: 'Doubles the points for any word played over it', text: '2xW', multiplier: 2, adder: 0, placement: 'board', scope: 'word', style: { backgroundColor: 'rgba(18, 138, 84, 0.4)', border: '4px double rgb(18, 138, 84)' }, threshhold: 3 },
  BTW: { rarity: 3, price: 6, name: 'Triple Word Space', description: 'Triples the points for any word played over it', text: '3xW', multiplier: 3, adder: 0, placement: 'board', scope: 'word', style: { backgroundColor: 'rgba(31, 161, 154, 0.4)', border: '4px double rgb(31, 161, 154)' }, threshhold: 4 },
  TDL: { rarity: 0, price: 4, name: 'Double Letter Tile', description: "Doubles this letter's base score", text: '2xL', multiplier: 2, adder: 0, placement: 'tile', scope: 'letter', style: { backgroundColor: 'rgba(39, 219, 15, 0.4)', border: '4px double rgb(39, 219, 15)' } },
  TTL: { rarity: 1, price: 5, name: 'Triple Letter Tile', description: "Triples this letter's base score", text: '3xL', multiplier: 3, adder: 0, placement: 'tile', scope: 'letter', style: { backgroundColor: 'rgba(138, 97, 32, 0.4)', border: '4px double rgb(138, 97, 32)' } },
  TDW: { rarity: 2, price: 6, name: 'Double Word Tile', description: "Doubles the base score for words this letter is part of", text: '2xW', multiplier: 2, adder: 0, placement: 'tile', scope: 'word', style: { backgroundColor: 'rgba(217, 122, 63, 0.4)', border: '4px double rgb(217, 122, 63)' } },
  TTW: { rarity: 3, price: 7, name: 'Triple Word Tile', description: "Triples the base score for words this letter is part of", text: '3xW', multiplier: 3, adder: 0, placement: 'tile', scope: 'word', style: { backgroundColor: 'rgba(219, 209, 22, 0.4)', border: '4px double rgb(219, 209, 22)' } },
  EDGE: { rarity: 1, price: 10, name: 'Board Edge', description: 'Place this upgrade on the edge of the board give yourself more room to play', text: 'EDGE', placement: 'edge', style: { backgroundColor: 'rgba(102, 105, 112, 0.6)', border: '4px double rgb(102, 105, 112)' } },
  JOKER: { rarity: 3, price: 15, name: 'Joker', description: 'Purchase this upgrade to permanently add a joker space', text: 'JOKER', placement: false, style: { backgroundColor: 'rgba(150, 30, 114, 0.6)', border: '4px double rgb(150, 30, 114)' } },
  TP1: { rarity: 0, price: 3, name: '+1 Base Score', description: 'Place this upgrade on a tile to increase its base score by one', text: '+1L', multiplier: 0, adder: 1, placement: 'tile', scope: 'letter', style: { backgroundColor: 'rgba(190, 71, 237, 0.4)', border: '4px double rgb(190, 71, 237)' }, threshhold: 4 },
  TP3: { rarity: 1, price: 5, name: '+3 Base Score', description: 'Place this upgrade on a tile to increase its base score by three', text: '+3L', multiplier: 0, adder: 3, placement: 'tile', scope: 'letter', style: { backgroundColor: 'rgba(16, 143, 227, 0.4)', border: '4px double rgb(16, 143, 227)' }, threshhold: 4 },
  TP5: { rarity: 2, price: 7, name: '+5 Base Score', description: 'Place this upgrade on a tile to increase its base score by five', text: '+5L', multiplier: 0, adder: 5, placement: 'tile', scope: 'letter', style: { backgroundColor: 'rgba(72, 99, 43, 0.4)', border: '4px double rgb(72, 99, 43)' }, threshhold: 4 },
  BP1: { rarity: 1, price: 4, name: '+1 Letter Space', description: 'Increase the base score of any word played on it by one', text: '+1L', multiplier: 0, adder: 1, placement: 'board', scope: 'letter', style: { backgroundColor: 'rgba(224, 88, 70, 0.4)', border: '4px double rgb(224, 88, 70)' }, threshhold: 4 },
  BP3: { rarity: 2, price: 6, name: '+3 Letter Space', description: 'Increase the base score of any word played on it by three', text: '+3L', multiplier: 0, adder: 3, placement: 'board', scope: 'letter', style: { backgroundColor: 'rgba(230, 53, 97, 0.4)', border: '4px double rgb(230, 53, 97)' }, threshhold: 4 },
  BP5: { rarity: 3, price: 8, name: '+5 Letter Space', description: 'Increase the base score of any word played on it by five', text: '+5L', multiplier: 0, adder: 5, placement: 'board', scope: 'letter', style: { backgroundColor: 'rgba(166, 113, 227, 0.4)', border: '4px double rgb(166, 113, 227)' }, threshhold: 4 },
  TM1: { rarity: 3, price: 3, name: '+$1', description: 'Place this upgrade on a tile to earn $1 every time it is scored', text: '+$1', money: 1, multiplier: 0, adder: 0, placement: 'tile', scope: 'letter', style: { backgroundColor: 'rgba(214, 168, 0, 0.4)', border: '4px double rgb(214, 168, 0)' }, threshhold: 4 },
};

export const JOKERS = [
  {
    rarity: 1,
    price: 4,
    id: v4(),
    text: '2️⃣',
    name: 'X 2',
    description: 'Multiplies the total score by two',
    action: ({
      words,
      grid,
      totalScore,
      invalidScore
    }) => {
      return {
        newScore: totalScore * 2,
        delta: totalScore,
        newMoney: 0
      };
    },
    style: {
      border: '2px solid rgb(170, 191, 33)',
      backgroundColor: 'rgba(170, 191, 33, 0.4)'
    }
  },
  {
    rarity: 0,
    price: 3,
    id: v4(),
    text: '➕',
    name: '+ 20',
    description: 'Adds 20 to the total score',
    action: ({
      words,
      grid,
      totalScore,
      invalidScore
    }) => {
      return {
        newScore: totalScore + 20,
        delta: 20,
        newMoney: 0
      };
    },
    style: {
      border: '2px solid rgb(191, 33, 35)',
      backgroundColor: 'rgba(191, 33, 35, 0.4)'
    }
  },
  {
    rarity: 2,
    price: 5,
    id: v4(),
    text: '❌',
    name: 'Crosser',
    description: 'Adds +1 multiplier for every intersection (max +5)',
    action: ({
      words,
      grid,
      totalScore,
      invalidScore
    }) => {
      const tileCounts = {};
      words.flat().filter((w) => w.valid).forEach((w) => w.tiles?.forEach((t) => tileCounts[t.props?.id] = tileCounts[t.props?.id] ? tileCounts[t.props?.id] += 1 : 1))
      const newScore = (1 + Math.min((Object.keys(tileCounts).filter((k) => tileCounts[k] > 1).length), 5)) * totalScore;
      return {
        newScore,
        newMoney: 0,
        delta: newScore - totalScore
      };
    },
    style: {
      border: '2px solid rgb(245, 64, 184)',
      backgroundColor: 'rgba(245, 64, 184, 0.4)'
    }
  },
  {
    rarity: 1,
    price: 6,
    id: v4(),
    text: '💰',
    name: 'Banker',
    description: '+$1 for every word',
    action: ({
      words,
      grid,
      totalScore,
      invalidScore
    }) => {
      const wordCount = words[words.length - 1].filter((w) => w.valid).length
      return {
        newScore: totalScore,
        delta: 0,
        newMoney: wordCount * 1
      };
    },
    style: {
      border: '2px solid rgb(237, 193, 50)',
      backgroundColor: 'rgba(237, 193, 50, 0.4)'
    }
  },
  {
    rarity: 2,
    price: 3,
    id: v4(),
    text: '🅰️',
    name: 'Vowel Movement',
    description: '+1 point for every vowel',
    action: ({
      words,
      grid,
      totalScore,
      invalidScore
    }) => {
      let vowelCount = 0;
      const vowels = ['A', 'E', 'I', 'O', 'U'];
      words[words.length - 1].filter((w) => w.valid).forEach((w) => w.word.split('').forEach((c) => {
        if (vowels.includes(c)) {
          vowelCount += 1;
        }
      }));
      return {
        newScore: totalScore + vowelCount,
        delta: vowelCount,
        newMoney: 0
      };
    },
    style: {
      border: '2px solid rgb(33, 117, 71)',
      backgroundColor: 'rgba(33, 117, 71, 0.4)'
    }
  },
  {
    rarity: 1,
    price: 3,
    id: v4(),
    text: '⬆️',
    name: 'Less Worse',
    description: 'Halve the penalty for invalid words',
    action: ({
      words,
      grid,
      totalScore,
      invalidScore
    }) => {
      const newScore = totalScore + (Math.floor(invalidScore / 2));
      return {
        newScore,
        delta: newScore - totalScore,
        newMoney: 0
      };
    },
    style: {
      border: '2px solid rgb(145, 28, 39)',
      backgroundColor: 'rgba(145, 28, 39, 0.4)'
    }
  },
  {
    rarity: 2,
    price: 5,
    id: v4(),
    text: '🧠',
    name: 'Brainiac',
    description: '+2 multiplier for every valid word, but +5 multiplier for every invalid word',
    action: ({
      words,
      grid,
      totalScore,
      validScore,
      invalidScore
    }) => {
      const newValid = validScore;
      const newInvalid = invalidScore * 4;
      return {
        newScore: totalScore + (newValid - newInvalid),
        delta: (newValid - newInvalid),
        newMoney: 0
      };
    },
    style: {
      border: '2px solid rgb(94, 87, 81)',
      backgroundColor: 'rgba(94, 87, 81, 0.4)'
    }
  },
  {
    rarity: 3,
    price: 9,
    id: v4(),
    text: '🫅',
    name: 'Short King',
    description: '+5 points for every word with 3 or fewer tiles',
    action: ({
      words,
      grid,
      totalScore,
      validScore,
      invalidScore
    }) => {
      let newScore = 0;
      words[words.length - 1].filter((w) => w.valid).forEach((w) => {
        if (w.tiles.length <= 3) {
          newScore += 5;
        }
      });
      newScore = totalScore + (newScore);
      return {
        newScore,
        delta: newScore - totalScore,
        newMoney: 0
      };
    },
    style: {
      border: '2px solid rgb(151, 79, 209)',
      backgroundColor: 'rgba(151, 79, 209, 0.4)'
    }
  },
  {
    rarity: 2,
    price: 6,
    id: v4(),
    text: '🍆',
    name: 'Big Word Energy',
    description: '+5 points for every word with 6 or more tiles',
    action: ({
      words,
      grid,
      totalScore,
      validScore,
      invalidScore
    }) => {
      let newScore = 0;
      words[words.length - 1].filter((w) => w.valid).forEach((w) => {
        if (w.tiles.length >= 6) {
          newScore += 5;
        }
      });
      return {
        newScore: totalScore + (newScore),
        delta: newScore,
        newMoney: 0
      };
    },
    style: {
      border: '2px solid rgb(133, 197, 201)',
      backgroundColor: 'rgba(133, 197, 201, 0.4)'
    }
  },
  {
    rarity: 1,
    price: 6,
    id: v4(),
    text: '🩴',
    name: 'Flip Flop',
    description: '+1 swap every round',
    global: {
      swaps: 1
    },
    style: {
      border: '2px solid rgb(245, 154, 233)',
      backgroundColor: 'rgba(245, 154, 233, 0.4)'
    }
  },
  {
    rarity: 1,
    price: 6,
    id: v4(),
    text: '↪️',
    name: 'Try Again!',
    description: '+1 turn every round',
    global: {
      turns: 1
    },
    style: {
      border: '2px solid rgb(227, 202, 59)',
      backgroundColor: 'rgba(227, 202, 59, 0.4)'
    }
  },
  {
    rarity: 2,
    price: 6,
    id: v4(),
    text: '🥞',
    name: 'Cornucopia',
    description: '+3 tiles per turn',
    global: {
      draws: 3
    },
    style: {
      border: '2px solid rgb(23, 99, 230)',
      backgroundColor: 'rgba(23, 99, 230, 0.4)'
    }
  },
  {
    rarity: 1,
    price: 6,
    id: v4(),
    text: '⚰️',
    name: 'Overkiller',
    description: '+$4 for every multiple of the target score you reach',
    action: ({
      words,
      grid,
      totalScore,
      validScore,
      invalidScore,
      target
    }) => {
      return {
        newScore: totalScore,
        delta: 0,
        newMoney: Math.floor(totalScore / target) * 4
      };
    },
    style: {
      border: '2px solid rgb(240, 218, 225)',
      backgroundColor: 'rgba(240, 218, 225, 0.4)'
    }
  },
  {
    rarity: 2,
    price: 5,
    id: v4(),
    text: '🏦',
    name: 'Investor',
    description: '+1 multiplier for every $3 you have in your bank. Warning: this will be negative if you are in debt',
    action: ({
      funds,
      grid,
      totalScore,
      validScore,
      invalidScore
    }) => {
      const newMult = Math.floor(funds / 3);
      return {
        newScore: totalScore * newMult,
        delta: (totalScore * newMult - totalScore),
        newMoney: 0
      };
    },
    style: {
      border: '2px solid rgb(74, 74, 74)',
      backgroundColor: 'rgba(74, 74, 74, 0.4)'
    }
  },
  {
    rarity: 3,
    price: 2,
    id: v4(),
    text: '🦈',
    name: 'Loan Shark',
    description: 'Allows you to go into debt to buy upgrades (max $20). Warning: you will owe interest on your debt',
    global: {
      debt: 20
    },
    style: {
      border: '2px solid rgb(73, 80, 145)',
      backgroundColor: 'rgba(73, 80, 145, 0.4)'
    }
  },
  {
    rarity: 3,
    price: 7,
    id: v4(),
    text: '📿',
    name: 'Hail Mary',
    description: "Rescores final turn of the round if you haven't reached the target score",
    global: {
      rescore: true,
    },
    style: {
      border: '2px solid rgb(138, 179, 255)',
      backgroundColor: 'rgba(138, 179, 255, 0.4)'
    }
  },
  {
    rarity: 3,
    price: 11,
    id: v4(),
    text: '🫳',
    name: 'Choosy',
    description: "-1 swap per round, and limits the amount of tiles per swap to 1, but allows you to choose the new tile",
    global: {
      choosy: true,
      swaps: -1,
    },
    style: {
      border: '2px solid rgb(124, 140, 88)',
      backgroundColor: 'rgba(124, 140, 88, 0.4)'
    }
  },
  {
    rarity: 2,
    price: 7,
    id: v4(),
    text: '3️⃣',
    name: 'X 3',
    description: '-1 turn per round, but triples the total score',
    global: {
      turns: -1,
    },
    action: ({
      words,
      grid,
      totalScore,
      invalidScore
    }) => {
      return {
        newScore: totalScore * 3,
        delta: totalScore * 2,
        newMoney: 0
      };
    },
    style: {
      border: '2px solid rgb(150, 123, 14)',
      backgroundColor: 'rgba(150, 123, 14, 0.4)'
    }
  },
  {
    rarity: 3,
    price: 6,
    id: v4(),
    text: '🥡',
    name: 'Leftovers',
    description: 'Multiply the total score by the value of the lowest scoring tile left in your tray',
    action: ({
      words,
      grid,
      tray,
      totalScore,
      invalidScore
    }) => {
      const lowestScoreTile = tray.reduce((acc, t) => {
        return t.props?.score < acc ? t.props.score : acc;
      });
      return {
        newScore: totalScore * lowestScoreTile,
        delta: totalScore * (lowestScoreTile - 1),
        newMoney: 0
      };
    },
    style: {
      border: '2px solid rgb(191, 191, 189)',
      backgroundColor: 'rgba(191, 191, 189, 0.4)'
    }
  },
];