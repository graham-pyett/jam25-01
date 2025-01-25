import { v4 } from 'uuid';

export const getStarterLetters = () => [
  ...Array(2).fill().map(() => ({ "id": v4(), "letter": "?", "value": 0 })),
  ...Array(12).fill().map(() => ({ "id": v4(), "letter": "E", "value": 1 })),
  ...Array(9).fill().map(() => ({ "id": v4(), "letter": "A", "value": 1 })),
  ...Array(9).fill().map(() => ({ "id": v4(), "letter": "I", "value": 1 })),
  ...Array(8).fill().map(() => ({ "id": v4(), "letter": "O", "value": 1 })),
  ...Array(6).fill().map(() => ({ "id": v4(), "letter": "N", "value": 1 })),
  ...Array(6).fill().map(() => ({ "id": v4(), "letter": "R", "value": 1 })),
  ...Array(6).fill().map(() => ({ "id": v4(), "letter": "T", "value": 1 })),
  ...Array(4).fill().map(() => ({ "id": v4(), "letter": "L", "value": 1 })),
  ...Array(4).fill().map(() => ({ "id": v4(), "letter": "S", "value": 1 })),
  ...Array(4).fill().map(() => ({ "id": v4(), "letter": "U", "value": 1 })),
  ...Array(4).fill().map(() => ({ "id": v4(), "letter": "D", "value": 2 })),
  ...Array(3).fill().map(() => ({ "id": v4(), "letter": "G", "value": 2 })),
  ...Array(2).fill().map(() => ({ "id": v4(), "letter": "B", "value": 3 })),
  ...Array(2).fill().map(() => ({ "id": v4(), "letter": "C", "value": 3 })),
  ...Array(2).fill().map(() => ({ "id": v4(), "letter": "M", "value": 3 })),
  ...Array(2).fill().map(() => ({ "id": v4(), "letter": "P", "value": 3 })),
  ...Array(2).fill().map(() => ({ "id": v4(), "letter": "F", "value": 4 })),
  ...Array(2).fill().map(() => ({ "id": v4(), "letter": "H", "value": 4 })),
  ...Array(2).fill().map(() => ({ "id": v4(), "letter": "V", "value": 4 })),
  ...Array(2).fill().map(() => ({ "id": v4(), "letter": "W", "value": 4 })),
  ...Array(2).fill().map(() => ({ "id": v4(), "letter": "Y", "value": 4 })),
  ...Array(1).fill().map(() => ({ "id": v4(), "letter": "K", "value": 5 })),
  ...Array(1).fill().map(() => ({ "id": v4(), "letter": "J", "value": 8 })),
  ...Array(1).fill().map(() => ({ "id": v4(), "letter": "X", "value": 8 })),
  ...Array(1).fill().map(() => ({ "id": v4(), "letter": "Q", "value": 10 })),
  ...Array(1).fill().map(() => ({ "id": v4(), "letter": "Z", "value": 10 })),
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
