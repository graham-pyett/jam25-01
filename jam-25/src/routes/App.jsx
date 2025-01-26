import React, { useCallback, useRef, useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';
import Score from "../components/Score";
import Grid from "../components/Grid";
import Tray from "../components/Tray";
import Tile from "../components/Tile";
import { BONUS_LETTERS, getStarterLetters, shuffle } from "../letters";
import { checkValidWord } from "../words";
import InfoPanel from "../components/InfoPanel";
import Submit from "../components/Submit";
import BlankPicker from "../components/BlankPicker";
import { useGameData } from "../providers/GameDataProvider";
import { BONUSES, JOKERS } from "../upgrades";
import { v4 } from "uuid";
import InventoryItem from "../components/InventoryItem";
import InventoryTile from "../components/InventoryTile";
import Inventory from "../components/Inventory";
import Edge from "../components/Edge";
import Swapper from "../components/Swapper";
import Joker from "../components/Joker";
import JokerSpace from "../components/JokerSpace";

const TARGETS = [
  0,
  40,
  60,
  90,
  120,
  160,
  200,
  250,
  300,
  350,
  400,
  550,
  700,
  1000,
  1300,
  1800,
  2500,
  3500,
  5000,
  7500,
  10000,
  12000,
  15000,
  20000,
];

const App = () => {
  const { blanks, setBlanks, setFixedTiles, fixedTiles } = useGameData();
  const [tilesToDraw, setTilesToDraw] = useState(13);
  const [gridSizeY, setGridSizeY] = useState(7);
  const [gridSizeX, setGridSizeX] = useState(7);
  const [gameStarted, setGameStarted] = useState(false);
  const tileLibrary = useRef(getStarterLetters());
  const [allTiles, setAllTiles] = useState(shuffle(getStarterLetters().map((l) => <Tile key={l.id} letter={l} id={l.id} />)));
  const [bag, setBag] = useState(0);
  const [swaps, setSwaps] = useState(3);
  const [turns, setTurns] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(1);
  const currentTurnRef = useRef(0);
  const [funds, setFunds] = useState(3);
  const [availableTiles, setAvailableTiles] = useState([]);
  const [gridArray, setGridArray] = useState([[{ tile: null, bonus: null }]]);
  const [inventoryGridArray, setInventoryGridArray] = useState([[{ tile: null, bonus: null }]]);
  const [activeInventory, setActiveInventory] = useState(null);
  const [trayArray, setTrayArray] = useState(availableTiles);
  const [swapArray, setSwapArray] = useState([]);
  const [target, setTarget] = useState(TARGETS[0]);
  const [activeTile, setActiveTile] = useState(null);
  const [words, setWords] = useState([[]]);
  const bonusSpacesRef = useRef([{ id: `${Math.floor(gridSizeY / 2)},${Math.floor(gridSizeX / 2)}`, bonus: 'BDW' }]);
  const [blankPickerOpen, setBlankPickerOpen] = useState(false);
  const turnScores = useRef([]);
  const [totalScore, setTotalScore] = useState(0);
  const [round, setRound] = useState(0);
  const [roundOver, setRoundOver] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [availableUpgrades, setAvailableUpgrades] = useState([]);
  const [availableUpgradeTiles, setAvailableUpgradeTiles] = useState([]);
  const [availableJokers, setAvailableJokers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [possibleLetters, setPossibleLetters] = useState([]);
  const [jokers, setJokers] = useState([]);
  const [maxJokers, setMaxJokers] = useState(5);

  const scoreWord = useCallback((word) => {
    let baseScore = word.score || word.word.length;
    const bonuses = bonusSpacesRef.current.map((s) => ({ id: s.id, ...BONUSES[s.bonus] }));
    // Tile bonuses first
    word.tiles.forEach((t) => {
      if (t.props.letter.adder) {
        baseScore += t.props.letter.adder;
      }
      if (t.props.letter.multiplier) {
        baseScore *= t.props.letter.multiplier;
      }
    });
    // Board bonuses
    bonuses.filter((b) => b.scope === 'letter').forEach((b) => {
      const [row, col] = b.id.split(',').map((n) => parseInt(n));
      const tile = gridArray[row][col]?.tile?.props;
      if (tile && word.tiles.find((t) => t.props.id === tile?.id)) {
        baseScore += b.adder;
        baseScore += tile.letter.value * (b.multiplier === 0 ? 1 : b.multiplier);
      }
    });
    bonuses.filter((b) => b.scope === 'word').forEach((b) => {
      const [row, col] = b.id.split(',').map((n) => parseInt(n));
      const tile = gridArray[row][col]?.tile?.props;
      if (tile && word.tiles.find((t) => t.props.id === tile?.id)) {
        baseScore += b.adder;
        baseScore *= b.multiplier === 0 ? 1 : b.multiplier;
      }
    });
    return baseScore;
  }, [gridArray]);

  const score = useCallback(() => {
    const validScore = words[currentTurnRef.current].filter((w) => w.valid).reduce((acc, w) => acc + scoreWord(w), 0);
    const invalidScore = words[currentTurnRef.current].filter((w) => !w.valid).reduce((acc, w) => acc + scoreWord(w), 0);
    let currentScore = validScore - invalidScore;
    jokers.forEach((j) => {
      const { newScore, newMoney } = j.props?.joker?.action?.({ words: words, grid: gridArray, totalScore: currentScore });
      currentScore = newScore;
      setFunds((old) => old + newMoney);
    });
    turnScores.current[currentTurnRef.current] = currentScore;
    setTotalScore(turnScores.current.reduce((acc, s) => acc + s, 0));
    return turnScores.current.reduce((acc, s) => acc + s, 0);
  }, [gridArray, jokers, scoreWord, words]);

  const start = useCallback(() => {

    const newAllTiles = shuffle(tileLibrary.current).map((l) => <Tile key={l.id} letter={l} id={l.id} />);
    const drawn = newAllTiles.slice(0, tilesToDraw);
    setBag(newAllTiles.length - tilesToDraw);
    setAvailableTiles(drawn);
    setAllTiles(newAllTiles.slice(tilesToDraw));
    setTrayArray(drawn);
    setTurns(3);
    setSwaps(3);
    setSwapArray([]);
    currentTurnRef.current = 0;
    setCurrentTurn(1)
    setTotalScore(0);
    setWords([[]])
    turnScores.current = [];
    setTarget(TARGETS[round + 1] ?? TARGETS[TARGETS.length - 1]);
    setRound((old) => old + 1);
    setGridArray(() => Array(gridSizeY).fill().map((_row, r) => Array(gridSizeX).fill().map((_col, c) => {
      const bonusSpace = bonusSpacesRef.current.find((b) => {
        const [row, col] = b.id.split(',').map((n) => parseInt(n));
        return row === r && col === c;
      });
      return { id: `${r},${c}`, tile: null, bonus: bonusSpace?.bonus ?? null }
    })));
  }, [gridSizeY, gridSizeX, round, tilesToDraw]);

  const checkForWords = useCallback(() => {
    // find all words on the board
    const newFoundWords = [];
    // check rows
    gridArray.forEach((row, index) => {
      // find all tiles which have no neightbor to the left
      const startTiles = row.filter((t, i) => t.tile != null && (i === 0 || !row[i - 1].tile));
      startTiles.forEach((t) => {
        let i = row.indexOf(t);
        let word = '';
        let scr = 0;
        const wordTiles = [];
        let isNew = false;
        while (i < row.length && row[i].tile) {
          word += blanks?.[row[i].tile.props.id] ?? row[i].tile.props.letter.letter;
          scr += row[i].tile.props.letter.value;
          wordTiles.push(row[i].tile);
          if (!fixedTiles.includes(row[i].tile.props.id)) {
            isNew = true;
          }
          i++;
        }
        if (wordTiles.length > 1 && isNew) {
          const valid = checkValidWord(word);
          newFoundWords.push({ word, valid, score: scr, tiles: wordTiles });
        }
      });
    });
    // check columns
    for (let i = 0; i < gridArray.length; i++) {
      const col = gridArray.map((row) => row[i]);
      const startTiles = col.filter((t, i) => t.tile != null && (i === 0 || !col[i - 1].tile));
      startTiles.forEach((t) => {
        let j = col.indexOf(t);
        let word = '';
        const wordTiles = [];
        let scr = 0;
        let isNew = false;
        while (j < col.length && col[j].tile) {
          word += blanks?.[col[j].tile.props.id] ?? col[j].tile.props.letter.letter;
          scr += col[j].tile.props.letter.value;
          wordTiles.push(col[j].tile);
          if (!fixedTiles.includes(col[j].tile.props.id)) {
            isNew = true;
          }
          j++;
        }
        if (wordTiles.length > 1 && isNew) {
          const valid = checkValidWord(word);
          newFoundWords.push({ word, valid, score: scr, tiles: wordTiles });
        }
      });
    }
    // Find tiles with no neighbours
    gridArray.forEach((row, i) => {
      row.forEach((col, j) => {
        if (col.tile && !gridArray[i][j - 1]?.tile && !gridArray[i][j + 1]?.tile && !gridArray[i - 1]?.[j]?.tile && !gridArray[i + 1]?.[j]?.tile) {
          newFoundWords.push({ word: col.tile.props.letter.letter, valid: false, score: col.tile.props.letter.value, tiles: [col.tile] });
        }
      });
    });
    setWords((old) => { old[currentTurnRef.current] = newFoundWords; return old; });
  }, [blanks, fixedTiles, gridArray]);

  const endTurn = useCallback(() => {
    checkForWords();
    const newTotalScore = score();
    const newFixedTiles = [];
    gridArray.forEach((row) => row.forEach((col) => {
      if (col.tile) {
        newFixedTiles.push(col.tile.props.id);
      }
    }));
    setFixedTiles(newFixedTiles);

    currentTurnRef.current++;
    if (newTotalScore < target && currentTurnRef.current < turns) {
      setCurrentTurn((old) => old + 1);
      const ttd = tilesToDraw - trayArray.length - swapArray.length;
      const drawn = allTiles.slice(0, ttd);
      setBag(allTiles.length - ttd);
      const newTray = [...trayArray, ...swapArray, ...drawn];
      setAvailableTiles(newTray);
      setAllTiles((old) => old.slice(ttd));
      setTrayArray(newTray);
      setSwapArray([]);
      bonusSpacesRef.current.forEach((b) => {
        const [row, col] = b.id.split(',').map((n) => parseInt(n));
        setGridArray((old) => old.map((r, i) => r.map((c, j) => {
          if (i === row && j === col) {
            return { ...c, bonus: b.bonus };
          }
          return c;
        })));
      });
    } else {
      // Round over
      if (newTotalScore >= target) {
        setFixedTiles([]);
        setBlanks({});
        setAllTiles(tileLibrary.current);
        setRoundOver(true);
      } else {
        setGameOver(true);
      }
    }
  }, [allTiles, checkForWords, gridArray, score, setBlanks, setFixedTiles, swapArray, target, tilesToDraw, trayArray, turns]);

  const handleDragStart = useCallback((event) => {
    const newActiveTile = availableTiles.find((t) => t.props.id === event.active.id);
    setActiveTile(newActiveTile);
    setTrayArray((old) => [...old.filter((t) => t.props.id !== event.active.id)]);
    setSwapArray((old) => [...old.filter((t) => t.props.id !== event.active.id)]);
    setGridArray((old) => old.map((r) => r.map((c) => {
      if (c.tile === newActiveTile) {
        return { ...c, tile: null };
      }
      return c;
    })));

  }, [availableTiles]);

  const handleDragEnd = useCallback((event) => {
    if (event.over?.id && event.over.id !== 'tray' && event.over.id !== 'swapper') {
      const row = parseInt(event.over.id.split(',')[0]);
      const col = parseInt(event.over.id.split(',')[1]);
      setGridArray((old) => old.map((r, i) => r.map((c, j) => {
        if (i === row && j === col) {
          if (activeTile.props.letter.isBlank) {
            setBlankPickerOpen(true);
          }
          return {...c, tile: activeTile };
        }
        return c;
      })));
    } else if (event.over?.id && event.over.id === 'swapper') {
      setSwapArray((old) => [...old, activeTile]);
    } else {
      setTrayArray((old) => [...old, activeTile]);
    }
  }, [activeTile]);

  
  const handleDragInventoryStart = useCallback((event) => {
    const newActiveInventory = inventory.find((t) => t.props.item.id === event.active.id);
    setActiveInventory(newActiveInventory);
    setInventoryItems((old) => [...old.filter((t) => t.props.item.id !== event.active.id)]);
    setInventoryGridArray((old) => old.map((r) => r.map((c) => {
      if (c.tile === newActiveInventory) {
        return { ...c, tile: null };
      }
      return c;
    })));

  }, [inventory]);

  const handleUpgrade = useCallback((tile, upgrade) => {
    if (upgrade.placement === 'tile') {
      const newTile = { ...tile, ...upgrade, id: tile.id };
      tileLibrary.current = tileLibrary.current.filter((t) => t.id !== tile.id);
      tileLibrary.current.push(newTile);
      return newTile;
    }
    return tile;
  }, []);

  const handleDragInventoryEnd = useCallback((event) => {
    if (event.over?.id && event.over.id >=0 && event.over.id < 7 && activeInventory.props.item.placement === 'tile') {
      setPossibleLetters((old) => old.map((l, i) => {
        if (i === parseInt(event.over.id)) {
          const newTile = handleUpgrade(l.props.letter, activeInventory.props.item);
          return <Tile key={i} letter={newTile} id={newTile.id} />;
        }
        return l;
      }));
    } else if (event.over?.id && event.over.id === 'left' && activeInventory.props.item.placement === 'edge') {
      const newGridX = gridSizeX + 1;
      setGridSizeX(newGridX);
      bonusSpacesRef.current = bonusSpacesRef.current.map((b) => ({ ...b, id: `${b.id.split(',')[0]},${parseInt(b.id.split(',')[1]) + 1}` }));
      const newInventoryGridArray = Array(gridSizeY).fill().map((_row, r) => Array(newGridX).fill().map((_col, c) => {
        const bonusSpace = bonusSpacesRef.current.find((b) => {
          const [row, col] = b.id.split(',').map((n) => parseInt(n));
          return row === r && col === c;
        });
        return { id: `${r},${c}`, tile: null, bonus: bonusSpace?.bonus ?? null }
      }));
      setInventoryGridArray(newInventoryGridArray);
    } else if (event.over?.id && event.over.id === 'right' && activeInventory.props.item.placement === 'edge') {
      const newGridX = gridSizeX + 1;
      setGridSizeX(newGridX);
      const newInventoryGridArray = Array(gridSizeY).fill().map((_row, r) => Array(newGridX).fill().map((_col, c) => {
        const bonusSpace = bonusSpacesRef.current.find((b) => {
          const [row, col] = b.id.split(',').map((n) => parseInt(n));
          return row === r && col === c;
        });
        return { id: `${r},${c}`, tile: null, bonus: bonusSpace?.bonus ?? null }
      }));
      setInventoryGridArray(newInventoryGridArray);
    } else if (event.over?.id && event.over.id === 'top' && activeInventory.props.item.placement === 'edge') {
      const newGridY = gridSizeY + 1;
      setGridSizeY(newGridY);
      bonusSpacesRef.current = bonusSpacesRef.current.map((b) => ({ ...b, id: `${parseInt(b.id.split(',')[0]) + 1},${b.id.split(',')[1]}` }));
      const newInventoryGridArray = Array(newGridY).fill().map((_row, r) => Array(gridSizeX).fill().map((_col, c) => {
        const bonusSpace = bonusSpacesRef.current.find((b) => {
          const [row, col] = b.id.split(',').map((n) => parseInt(n));
          return row === r && col === c;
        });
        return { id: `${r},${c}`, tile: null, bonus: bonusSpace?.bonus ?? null }
      }));
      setInventoryGridArray(newInventoryGridArray);
    } else if (event.over?.id && event.over.id === 'bottom' && activeInventory.props.item.placement === 'edge') {
      const newGridY= gridSizeY + 1;
      setGridSizeY(newGridY);
      const newInventoryGridArray = Array(newGridY).fill().map((_row, r) => Array(gridSizeX).fill().map((_col, c) => {
        const bonusSpace = bonusSpacesRef.current.find((b) => {
          const [row, col] = b.id.split(',').map((n) => parseInt(n));
          return row === r && col === c;
        });
        return { id: `${r},${c}`, tile: null, bonus: bonusSpace?.bonus ?? null }
      }));
      setInventoryGridArray(newInventoryGridArray);
    } else if (event.over?.id && event.over.id !== 'inventory' && typeof event.over.id === 'string' && activeInventory.props.item.placement === 'board') {
      const row = parseInt(event.over.id.split(',')[0]);
      const col = parseInt(event.over.id.split(',')[1]);
      setInventoryGridArray((old) => old.map((r, i) => r.map((c, j) => {
        if (i === row && j === col) {
          return {...c, tile: activeInventory };
        }
        return c;
      })));
    } else {
      setInventoryItems((old) => [...old, activeInventory]);
    }
  }, [activeInventory, gridSizeY, gridSizeX, handleUpgrade]);


  const handleBlank = useCallback((letter) => {
    if (activeTile) {
      setBlanks((old) => ({ ...old, [activeTile.props.id]: letter }));
    }
    setBlankPickerOpen(false);
  }, [activeTile, setBlanks]);

  const getNewFunds = useCallback(() => {
    const base = 3;
    const remainingTurns = turns - currentTurn;
    const words = 0;

    return {
      base,
      turns: remainingTurns,
      words,
      total: base + remainingTurns + words,
    }
  }, [currentTurn, turns]);

  const handleOpenShop = useCallback(() => {
    setFunds((old) => getNewFunds().total + old)
    const newAvailableUpgrades = [];
    for (let i = 0; i < 2; i++) {
      const keys = Object.keys(BONUSES);
      const key = keys[Math.floor(Math.random() * keys.length)];
      newAvailableUpgrades.push({ id: v4(), key, ...BONUSES[key] });
    }
    const newAvailableUpgradeTiles = [];
    for (let i = 0; i < 3; i++) {
      const keys = Object.keys(BONUS_LETTERS);
      const key = keys[Math.floor(Math.random() * keys.length)];
      newAvailableUpgradeTiles.push({ key, ...BONUS_LETTERS[key], price: BONUS_LETTERS[key].price ?? BONUS_LETTERS[key].value, id: v4() });
    }
    const keys = Object.keys(BONUS_LETTERS);
    const key = keys[Math.floor(Math.random() * keys.length)];
    const bonusKeys = Object.keys(BONUSES).filter((b) => BONUSES[b].placement === 'tile');
    const bonusKey = bonusKeys[Math.floor(Math.random() * bonusKeys.length)];
    newAvailableUpgradeTiles.push({ key, ...BONUSES[bonusKey], ...BONUS_LETTERS[key], name: `${BONUSES[bonusKey].name} - ${BONUS_LETTERS[key].letter}`, price: Math.floor((BONUS_LETTERS[key].price ?? BONUS_LETTERS[key].value + BONUSES[bonusKey].price) / 2), id: v4() });
    const newAvailableJokers = [];
    for (let i = 0; i < 2; i++) {
      const keys = Object.keys(JOKERS);
      const key = keys[Math.floor(Math.random() * keys.length)];
      newAvailableJokers.push({ key, ...JOKERS[key], id: v4() });
    }
    setAvailableUpgrades(newAvailableUpgrades)
    setAvailableUpgradeTiles(newAvailableUpgradeTiles)
    setAvailableJokers(newAvailableJokers);
    setRoundOver(false);
    setShopOpen(true);
  }, [getNewFunds]);
  
  const handleNextRound = useCallback(() => {
    setPlacementOpen(false);
    const toRemove = [];
    inventory.forEach((i) => {
      const bonus = BONUSES[i.props.item.key];
      let bonusId = '';
      if (bonus?.placement === 'board') {
        inventoryGridArray.forEach((row, r) => row.forEach((col, c) => {
          if (col.tile?.props.item?.id === i.props.item.id) {
            bonusId = `${r},${c}`;
          }
        }));
        if (bonusId) {
          bonusSpacesRef.current = [...bonusSpacesRef.current, { id: bonusId, bonus: i.props.item.key }];
          toRemove.push(i.props.item.id);
        }
      }
      if (bonus.placement === 'tile') {
        possibleLetters.forEach((l) => {
          if (i.props.item.id === l.props.id) {
            toRemove.push(i.props.item.id);
          }
        })
      }
    });
    setInventory((old) => old.filter((i) => !toRemove.includes(i.props.item.id)));
    start();
  }, [inventory, inventoryGridArray, possibleLetters, start]);

  const handlePlacement = useCallback(() => {
    setShopOpen(false);
    if (inventory.length) {
      setPossibleLetters(shuffle(tileLibrary.current).slice(0, 7).map((l) => <Tile key={l.id} letter={l} id={l.id} />));
      setInventoryGridArray(() => Array(gridSizeY).fill().map((_row, r) => Array(gridSizeX).fill().map((_col, c) => {
        const bonusSpace = bonusSpacesRef.current.find((b) => {
          const [row, col] = b.id.split(',').map((n) => parseInt(n));
          return row === r && col === c;
        });
        return { id: `${r},${c}`, tile: null, bonus: bonusSpace?.bonus ?? null }
      })));
      
      setPlacementOpen(true);
    } else {
      handleNextRound();
    }
  }, [gridSizeY, gridSizeX, handleNextRound, inventory.length]);

  const handleGameOver = useCallback(() => {
    const newGridSize = 7;
    setGridSizeY(newGridSize);
    setGridSizeY(newGridSize);
    setInventory([]);
    setTilesToDraw(13);
    setGameOver(false);
    setRound(0);
    setJokers([]);
    setMaxJokers(5);
    tileLibrary.current = getStarterLetters();
    bonusSpacesRef.current = [{ id: `${Math.floor(newGridSize / 2)},${Math.floor(newGridSize / 2)}`, bonus: 'BDW' }];
    setGameStarted(false);
    setFunds(3);
    turnScores.current = [];
  }, []);

  const handleSwap = useCallback(() => {
    if (swaps > 0) {
      const ttd = swapArray.length;
      const drawn = allTiles.slice(0, ttd);
      setBag(allTiles.length - ttd);
      const newTray = [...trayArray, ...drawn];
      const gridTiles = [];
      gridArray.forEach((row) => row.forEach((col) => {
        if (col.tile) {
          gridTiles.push(col.tile);
        }
      }));
      setAvailableTiles([...newTray, ...gridTiles]);
      setAllTiles((old) => old.slice(ttd));
      setTrayArray(newTray);
      setSwapArray([]);
      setSwaps((old) => old - 1);
    }
  }, [allTiles, gridArray, swapArray.length, swaps, trayArray])

  if (!gameStarted) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ fontSize: '24px', mt: 4 }}>
          Welcome to the game!
        </Box>
        <Box sx={{ fontSize: '18px', mt: 2 }}>
          The object of the game is to make a crossword grid on the board with a high enough total score to beat the target.
        </Box>
        <Box sx={{ fontSize: '18px', mt: 1, color: 'tomato' }}>
          WARNING: Invalid words will be penalized!
        </Box>
        <Box sx={{ fontSize: '18px', mt: 1 }}>
          You have 3 turns to attempt this. Each turn will give you more letters.
        </Box>
        <Box sx={{ fontSize: '18px', mt: 1 }}>
          After each round you will earn money which you can spend in the shop to buy upgrades for the following rounds.
        </Box>
        <Box sx={{ fontSize: '18px', mt: 2 }}>
          Click the button below to start the game.
        </Box>
        <Box sx={{ mt: 4 }}>
          <Button onClick={() => { start(); setGameStarted(true); }}>
            Start Game
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Dialog open={roundOver}>
        <DialogTitle>Round Over</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ fontSize: '24px', mt: 2 }}>Round {round} Over</Box>
            <Box sx={{ fontSize: '24px', mt: 2, color: 'seagreen' }}>Total Score: {totalScore}/{target}</Box>
      
              <Box sx={{ width: '100%', fontSize: '24px', mt: 2, color: 'goldenrod', display: 'flex', justifyContent: 'space-between' }}><span>Money Earned:</span><span>+${getNewFunds().total}</span></Box>
              <Divider />
              <Box sx={{  width: '100%', fontSize: '16px', mt: 1, color: 'goldenrod', display: 'flex', justifyContent: 'space-between' }}><span>Base:</span><span>+${getNewFunds().base}</span></Box>
              <Box sx={{  width: '100%', fontSize: '16px', mt: 1, color: 'goldenrod', display: 'flex', justifyContent: 'space-between' }}><span>Remaining Turns:</span><span>+${getNewFunds().turns}</span></Box>
              <Box sx={{  width: '100%', fontSize: '16px', mt: 1, color: 'goldenrod', display: 'flex', justifyContent: 'space-between' }}><span>Word bonus:</span><span>+${getNewFunds().words}</span></Box>
     
          </Box>
          <Box sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Button onClick={handleOpenShop}>Open Shop</Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog open={shopOpen}>
        <DialogTitle>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography variant='h5'>Shop!</Typography>
            <Typography variant='h5' sx={{ color: 'goldenrod' }}>${funds}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant='overline'>Inventory</Typography>
          <Box sx={{ minHeight: 50, mb: 2, p: 1, backgroundColor: 'gainsboro', border: '1px solid lightgrey', borderRadius: '8px' }}>
            {inventoryItems}
          </Box>
          <Typography variant='overline'>Available Jokers</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', mt: -2 }}>	
              {availableJokers.map((u) => (
                <Box key={u.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', p: 2, m: 2, maxWidth: '30%' }}>
                  {
                    u.disabled && <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', zIndex: 5 }} />
                  }
                  <Joker joker={u} id={u.id} />
                  <Typography variant='h6'>{u.name}</Typography>
                  <Typography variant='body1' sx={{ textAlign: 'center' }}>{u.description}</Typography>
                  <Typography variant='body1'>Price: ${u.price}</Typography>
                  <Button disabled={u.disabled || funds < u.price || jokers.length >= maxJokers} onClick={() => {
                    if (funds >= u.price) {
                      setFunds((old) => old - u.price);
                      setJokers((old) => [...old, <Joker joker={u} />]);
                      setAvailableJokers((old) => old.map((a) => ({ ...a, disabled: a.id === u.id })));
                    }
                  }}>Buy</Button>
                </Box>
              ))}
            </Box>
          </Box>
          <Typography variant='overline'>Available Upgrades</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', mt: -2 }}>	
              {availableUpgrades.map((u) => (
                <Box key={u.id} sx={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'center', position: 'relative', p: 2, m: 2, ...u.style }}>
                  {
                    u.disabled && <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', zIndex: 5 }} />
                  }
                  <Typography variant='h6'>{u.name}</Typography>
                  <Typography variant='body1' sx={{ textAlign: 'center' }}>{u.description}</Typography>
                  <Typography variant='body1'>Price: ${u.price}</Typography>
                  <Button disabled={u.disabled || funds < u.price} onClick={() => {
                    if (funds >= u.price) {
                      setFunds((old) => old - u.price);
                      setInventory((old) => [...old, <InventoryItem item={u} />]);
                      setInventoryItems((old) => [...old, <InventoryItem item={u} />]);
                      setAvailableUpgrades((old) => old.map((a) => ({ ...a, disabled: a.id === u.id })));
                    }
                  }}>Buy</Button>
                </Box>
              ))}
            </Box>
          </Box>
          <Typography variant='overline'>Available Tiles</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', mt: -2 }}>	
              {availableUpgradeTiles.map((u) => (
                <Box key={u.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', p: 2, m: 2, ...u.style }}>
                  {
                    u.disabled && <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', zIndex: 5 }} />
                  }
                  <Tile letter={u} id={u.id} />
                  { u.name && <Typography variant='h6'>{u.name}</Typography> }
                  { u.description && <Typography variant='body1' sx={{ textAlign: 'center' }}>{u.description}</Typography> }
                  <Typography variant='body1'>Price: ${u.price}</Typography>
                  <Button disabled={u.disabled || funds < u.price} onClick={() => {
                    if (funds >= u.price) {
                      setFunds((old) => old - u.price);
                      tileLibrary.current.push(u);
                      setAvailableUpgradeTiles((old) => old.map((a) => ({ ...a, disabled: a.id === u.id })));
                    }
                  }}>Buy</Button>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Button onClick={handlePlacement}>{inventory.length ? 'Continue' : 'Next Round'}</Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog open={placementOpen}>
        <DialogTitle>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography variant='h5'>Shop!</Typography>
            <Typography variant='h5' sx={{ color: 'goldenrod' }}>${funds}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant='overline'>Inventory</Typography>
          <DndContext onDragStart={handleDragInventoryStart} onDragEnd={handleDragInventoryEnd}>
              <Inventory items={inventoryItems} />
              <DragOverlay>
                {activeInventory}
              </DragOverlay>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mb: 2 }}>
                {
                  possibleLetters.map((l, i) => (
                    <InventoryTile tile={l} id={i} />
                  ))
                }
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Edge side="top" />
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Edge side="left" />
                  <Grid gridArray={inventoryGridArray} />
                  <Edge side="right" />
                </Box>
                <Edge side="bottom" />
              </Box>
          </DndContext>
          <Box sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Button onClick={handleNextRound}>Next Round</Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog open={gameOver}>
        <DialogTitle>Game Over</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ fontSize: '24px', mt: 2 }}>Game Over!</Box>
            <Box sx={{ fontSize: '24px', mt: 2, color: 'tomato' }}>Total Score: {totalScore}/{target}</Box>
            <Box sx={{ mt: 2 }}>
              <Button onClick={handleGameOver}>Start Over</Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <BlankPicker open={!!blankPickerOpen} handleClick={handleBlank} />
          <Box sx={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', mt: 2 }}>
            <Score score={totalScore} target={target} round={round} />
            <Submit onSubmit={endTurn} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 120, left: '50%', transform: 'translateX(-50%)', p: 2, backgroundColor: 'oldlace', borderRadius: '8px', zIndex: 5 }}>
            {
              Array(maxJokers).fill().map((_, i) => (
                <JokerSpace key={i} joker={jokers[i] ?? null} />
              ))
            }
          </Box>
          <Box sx={{ position: 'relative', top: 220 }}>
            <Grid gridArray={gridArray} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', mt: 4, position: 'fixed', bottom: 0, mb: 2, left: '50%', transform: 'translateX(-50%)' }}>
            <InfoPanel bag={bag} swaps={swaps} turn={currentTurn} turns={turns} money={funds} />
            <Tray tiles={trayArray} />
            <Swapper tiles={swapArray} handleSwap={handleSwap} swaps={swaps} />
          </Box>
          <DragOverlay>
            { activeTile }
          </DragOverlay>
        </Box>
      </DndContext>
    </>
    
  );
};

export default App;
