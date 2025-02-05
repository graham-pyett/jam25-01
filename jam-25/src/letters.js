import { v4 } from 'uuid';

export const getStarterLetters = () => [
  ...Array(2).fill().map(() => ({ rarity: 2, "id": `BLANK-${v4()}`, "letter": "?", "value": 0, isBlank: true })),
  ...Array(12).fill().map(() => ({ rarity: 0, "id": `E-${v4()}`, "letter": "E", "value": 1 })),
  ...Array(9).fill().map(() => ({ rarity: 0, "id": `A-${v4()}`, "letter": "A", "value": 1 })),
  ...Array(9).fill().map(() => ({ rarity: 0, "id": `I-${v4()}`, "letter": "I", "value": 1 })),
  ...Array(8).fill().map(() => ({ rarity: 0, "id": `O-${v4()}`, "letter": "O", "value": 1 })),
  ...Array(6).fill().map(() => ({ rarity: 0, "id": `N-${v4()}`, "letter": "N", "value": 1 })),
  ...Array(6).fill().map(() => ({ rarity: 0, "id": `R-${v4()}`, "letter": "R", "value": 1 })),
  ...Array(6).fill().map(() => ({ rarity: 0, "id": `T-${v4()}`, "letter": "T", "value": 1 })),
  ...Array(4).fill().map(() => ({ rarity: 0, "id": `L-${v4()}`, "letter": "L", "value": 1 })),
  ...Array(4).fill().map(() => ({ rarity: 0, "id": `S-${v4()}`, "letter": "S", "value": 1 })),
  ...Array(4).fill().map(() => ({ rarity: 0, "id": `U-${v4()}`, "letter": "U", "value": 1 })),
  ...Array(4).fill().map(() => ({ rarity: 0, "id": `D-${v4()}`, "letter": "D", "value": 2 })),
  ...Array(3).fill().map(() => ({ rarity: 0, "id": `G-${v4()}`, "letter": "G", "value": 2 })),
  ...Array(2).fill().map(() => ({ rarity: 0, "id": `B-${v4()}`, "letter": "B", "value": 3 })),
  ...Array(2).fill().map(() => ({ rarity: 0, "id": `C-${v4()}`, "letter": "C", "value": 3 })),
  ...Array(2).fill().map(() => ({ rarity: 0, "id": `M-${v4()}`, "letter": "M", "value": 3 })),
  ...Array(2).fill().map(() => ({ rarity: 0, "id": `P-${v4()}`, "letter": "P", "value": 3 })),
  ...Array(2).fill().map(() => ({ rarity: 0, "id": `F-${v4()}`, "letter": "F", "value": 4 })),
  ...Array(2).fill().map(() => ({ rarity: 0, "id": `H-${v4()}`, "letter": "H", "value": 4 })),
  ...Array(2).fill().map(() => ({ rarity: 0, "id": `V-${v4()}`, "letter": "V", "value": 4 })),
  ...Array(2).fill().map(() => ({ rarity: 0, "id": `W-${v4()}`, "letter": "W", "value": 4 })),
  ...Array(2).fill().map(() => ({ rarity: 0, "id": `Y-${v4()}`, "letter": "Y", "value": 4 })),
  ...Array(1).fill().map(() => ({ rarity: 0, "id": `K-${v4()}`, "letter": "K", "value": 5 })),
  ...Array(1).fill().map(() => ({ rarity: 0, "id": `J-${v4()}`, "letter": "J", "value": 8 })),
  ...Array(1).fill().map(() => ({ rarity: 0, "id": `X-${v4()}`, "letter": "X", "value": 8 })),
  ...Array(1).fill().map(() => ({ rarity: 0, "id": `Q-${v4()}`, "letter": "Q", "value": 10 })),
  ...Array(1).fill().map(() => ({ rarity: 0, "id": `Z-${v4()}`, "letter": "Z", "value": 10 })),
];

export const BONUS_LETTERS = [
  { rarity: 2, "id": v4(), "price": 8, "letter": "?", "value": 0, isBlank: true },
  { rarity: 0, "id": v4(), "letter": "A", "value": 1 },
  { rarity: 0, "id": v4(), "letter": "E", "value": 1 },
  { rarity: 0, "id": v4(), "letter": "I", "value": 1 },
  { rarity: 0, "id": v4(), "letter": "O", "value": 1 },
  { rarity: 0, "id": v4(), "letter": "U", "value": 1 },
  { rarity: 0, "id": v4(), "letter": "L", "value": 1 },
  { rarity: 0, "id": v4(), "letter": "N", "value": 1 },
  { rarity: 0, "id": v4(), "letter": "S", "value": 1 },
  { rarity: 0, "id": v4(), "letter": "T", "value": 1 },
  { rarity: 0, "id": v4(), "letter": "R", "value": 1 },
  { rarity: 0, "id": v4(), "letter": "D", "value": 2 },
  { rarity: 0, "id": v4(), "letter": "G", "value": 2 },
  { rarity: 0, "id": v4(), "letter": "B", "value": 3 },
  { rarity: 0, "id": v4(), "letter": "C", "value": 3 },
  { rarity: 0, "id": v4(), "letter": "M", "value": 3 },
  { rarity: 0, "id": v4(), "letter": "P", "value": 3 },
  { rarity: 0, "id": v4(), "letter": "F", "value": 4 },
  { rarity: 0, "id": v4(), "letter": "H", "value": 4 },
  { rarity: 0, "id": v4(), "letter": "V", "value": 4 },
  { rarity: 0, "id": v4(), "letter": "W", "value": 4 },
  { rarity: 0, "id": v4(), "letter": "Y", "value": 4 },
  { rarity: 0, "id": v4(), "letter": "K", "value": 5 },
  { rarity: 0, "id": v4(), "letter": "J", "value": 8 },
  { rarity: 0, "id": v4(), "letter": "X", "value": 8 },
  { rarity: 0, "id": v4(), "letter": "Q", "value": 10 },
  { rarity: 0, "id": v4(), "letter": "Z", "value": 10 },
  { rarity: 1, "id": v4(), "letter": "QU", "value": 11 },
  { rarity: 1, "id": v4(), "letter": "CH", "value": 4 },
  { rarity: 1, "id": v4(), "letter": "GH", "value": 3 },	
  { rarity: 1, "id": v4(), "letter": "SH", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "TH", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "WH", "value": 5 },
  { rarity: 1, "id": v4(), "letter": "PH", "value": 4 },
  { rarity: 1, "id": v4(), "letter": "AY", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "EE", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "EA", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "OI", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "AI", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "ON", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "IN", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "AT", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "ED", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "ER", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "LY", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "ES", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "ST", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "NT", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "RE", "value": 2 },
  { rarity: 1, "id": v4(), "letter": "HE", "value": 5 },
  { rarity: 1, "id": v4(), "letter": "AN", "value": 2 },
  { rarity: 2, "id": v4(), "letter": "THE", "value": 3 },
  { rarity: 2, "id": v4(), "letter": "THA", "value": 3 },
  { rarity: 2, "id": v4(), "letter": "ENT", "value": 3 },
  { rarity: 2, "id": v4(), "letter": "ION", "value": 3 },
  { rarity: 2, "id": v4(), "letter": "TIO", "value": 3 },
  { rarity: 2, "id": v4(), "letter": "AND", "value": 3 },
  { rarity: 2, "id": v4(), "letter": "ING", "value": 3 },
  { rarity: 2, "id": v4(), "letter": "FOR", "value": 6 },
  { rarity: 2, "id": v4(), "letter": "NDE", "value": 3 },
  { rarity: 2, "id": v4(), "letter": "HAS", "value": 6 },
  { rarity: 2, "id": v4(), "letter": "OFT", "value": 3 },
  { rarity: 2, "id": v4(), "letter": "NCE", "value": 3 },
  { rarity: 2, "id": v4(), "letter": "STR", "value": 3 },
  { rarity: 2, "id": v4(), "letter": "AIR", "value": 3 },
  { rarity: 2, "id": v4(), "letter": "DGE", "value": 4 },
  { rarity: 2, "id": v4(), "letter": "TCH", "value": 4 },
  { rarity: 2, "id": v4(), "letter": "IGH", "value": 4 },
  { rarity: 3, "id": v4(), "letter": "TION", "value": 4 },
  { rarity: 3, "id": v4(), "letter": "AUGH", "value": 4 },
  { rarity: 3, "id": v4(), "letter": "EIGH", "value": 4 },
  { rarity: 3, "id": v4(), "letter": "OUGH", "value": 4 },
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
