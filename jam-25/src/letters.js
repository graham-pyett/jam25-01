import { v4 } from 'uuid';

export const getStarterLetters = () => [
  ...Array(2).fill().map(() => ({ "id": `BLANK-${v4()}`, "letter": "?", "value": 0, isBlank: true })),
  ...Array(12).fill().map(() => ({ "id": `E-${v4()}`, "letter": "E", "value": 1 })),
  ...Array(9).fill().map(() => ({ "id": `A-${v4()}`, "letter": "A", "value": 1 })),
  ...Array(9).fill().map(() => ({ "id": `I-${v4()}`, "letter": "I", "value": 1 })),
  ...Array(8).fill().map(() => ({ "id": `O-${v4()}`, "letter": "O", "value": 1 })),
  ...Array(6).fill().map(() => ({ "id": `N-${v4()}`, "letter": "N", "value": 1 })),
  ...Array(6).fill().map(() => ({ "id": `R-${v4()}`, "letter": "R", "value": 1 })),
  ...Array(6).fill().map(() => ({ "id": `T-${v4()}`, "letter": "T", "value": 1 })),
  ...Array(4).fill().map(() => ({ "id": `L-${v4()}`, "letter": "L", "value": 1 })),
  ...Array(4).fill().map(() => ({ "id": `S-${v4()}`, "letter": "S", "value": 1 })),
  ...Array(4).fill().map(() => ({ "id": `U-${v4()}`, "letter": "U", "value": 1 })),
  ...Array(4).fill().map(() => ({ "id": `D-${v4()}`, "letter": "D", "value": 2 })),
  ...Array(3).fill().map(() => ({ "id": `G-${v4()}`, "letter": "G", "value": 2 })),
  ...Array(2).fill().map(() => ({ "id": `B-${v4()}`, "letter": "B", "value": 3 })),
  ...Array(2).fill().map(() => ({ "id": `C-${v4()}`, "letter": "C", "value": 3 })),
  ...Array(2).fill().map(() => ({ "id": `M-${v4()}`, "letter": "M", "value": 3 })),
  ...Array(2).fill().map(() => ({ "id": `P-${v4()}`, "letter": "P", "value": 3 })),
  ...Array(2).fill().map(() => ({ "id": `F-${v4()}`, "letter": "F", "value": 4 })),
  ...Array(2).fill().map(() => ({ "id": `H-${v4()}`, "letter": "H", "value": 4 })),
  ...Array(2).fill().map(() => ({ "id": `V-${v4()}`, "letter": "V", "value": 4 })),
  ...Array(2).fill().map(() => ({ "id": `W-${v4()}`, "letter": "W", "value": 4 })),
  ...Array(2).fill().map(() => ({ "id": `Y-${v4()}`, "letter": "Y", "value": 4 })),
  ...Array(1).fill().map(() => ({ "id": `K-${v4()}`, "letter": "K", "value": 5 })),
  ...Array(1).fill().map(() => ({ "id": `J-${v4()}`, "letter": "J", "value": 8 })),
  ...Array(1).fill().map(() => ({ "id": `X-${v4()}`, "letter": "X", "value": 8 })),
  ...Array(1).fill().map(() => ({ "id": `Q-${v4()}`, "letter": "Q", "value": 10 })),
  ...Array(1).fill().map(() => ({ "id": `Z-${v4()}`, "letter": "Z", "value": 10 })),
];

export const BONUS_LETTERS = [
  { "id": v4(), "price": 8, "letter": "?", "value": 0, isBlank: true },
  { "id": v4(), "letter": "A", "value": 1 },
  { "id": v4(), "letter": "E", "value": 1 },
  { "id": v4(), "letter": "I", "value": 1 },
  { "id": v4(), "letter": "O", "value": 1 },
  { "id": v4(), "letter": "U", "value": 1 },
  { "id": v4(), "letter": "L", "value": 1 },
  { "id": v4(), "letter": "N", "value": 1 },
  { "id": v4(), "letter": "S", "value": 1 },
  { "id": v4(), "letter": "T", "value": 1 },
  { "id": v4(), "letter": "R", "value": 1 },
  { "id": v4(), "letter": "D", "value": 2 },
  { "id": v4(), "letter": "G", "value": 2 },
  { "id": v4(), "letter": "B", "value": 3 },
  { "id": v4(), "letter": "C", "value": 3 },
  { "id": v4(), "letter": "M", "value": 3 },
  { "id": v4(), "letter": "P", "value": 3 },
  { "id": v4(), "letter": "F", "value": 4 },
  { "id": v4(), "letter": "H", "value": 4 },
  { "id": v4(), "letter": "V", "value": 4 },
  { "id": v4(), "letter": "W", "value": 4 },
  { "id": v4(), "letter": "Y", "value": 4 },
  { "id": v4(), "letter": "K", "value": 5 },
  { "id": v4(), "letter": "J", "value": 8 },
  { "id": v4(), "letter": "X", "value": 8 },
  { "id": v4(), "letter": "Q", "value": 10 },
  { "id": v4(), "letter": "Z", "value": 10 },
  { "id": v4(), "letter": "QU", "value": 11 },
  { "id": v4(), "letter": "CH", "value": 4 },	
  { "id": v4(), "letter": "SH", "value": 2 },
  { "id": v4(), "letter": "TH", "value": 2 },
  { "id": v4(), "letter": "WH", "value": 5 },
  { "id": v4(), "letter": "PH", "value": 4 },
  { "id": v4(), "letter": "AY", "value": 2 },
  { "id": v4(), "letter": "EE", "value": 2 },
  { "id": v4(), "letter": "EA", "value": 2 },
  { "id": v4(), "letter": "OI", "value": 2 },
  { "id": v4(), "letter": "AI", "value": 2 },
  { "id": v4(), "letter": "THE", "value": 3 },
  { "id": v4(), "letter": "AND", "value": 3 },
  { "id": v4(), "letter": "ING", "value": 3 },
  { "id": v4(), "letter": "TION", "value": 4 },
  { "id": v4(), "letter": "ED", "value": 3 },
  { "id": v4(), "letter": "ER", "value": 3 },
  { "id": v4(), "letter": "LY", "value": 3 },
  { "id": v4(), "letter": "ES", "value": 3 },
  { "id": v4(), "letter": "OFT", "value": 3 },
  { "id": v4(), "letter": "STR", "value": 3 },
];

export const shuffle = (array) => {
  const newArray = [...array];
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
}
