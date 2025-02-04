import React, { useCallback, useMemo, useRef, useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import Tour from 'reactour'
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Typography, useMediaQuery } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
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
import { useUser } from "../providers/UserProvider";
import Bag from "../components/Bag";

const calcTarget = (round) => {
  return Math.round(
    (
      Math.pow((round * 10), 1.85)
      + 350
    )
    / 100
  ) * 10;
}

// const TARGETS = [
//   0,
//   40,
//   60,
//   90,
//   120,
//   160,
//   200,
//   250,
//   300,
//   350,
//   400,
//   550,
//   700,
//   1000,
//   1300,
//   1800,
//   2500,
//   3500,
//   5000,
//   7500,
//   10000,
//   12000,
//   15000,
//   20000,
// ];

const App = () => {
  const { user, setDidTour, setDidShopTour } = useUser();
  const  matches = useMediaQuery('(max-width: 900px)');
  const { blanks, setBlanks, setFixedTiles, fixedTiles, setScoringTiles, setDealing, setBagTiles, setRoundOver: setGlobalRoundOver, setTurnOver, setRetrieving, setSwapTiles } = useGameData();
  const tilesToDrawRef = useRef(13);
  const [gridSizeY, setGridSizeY] = useState(7);
  const [gridSizeX, setGridSizeX] = useState(7);
  const [gameStarted, setGameStarted] = useState(false);
  const tileLibrary = useRef(getStarterLetters());
  const initialPositions = useRef({});
  const tilesOnBoard = useRef([]);
  const [allTiles, setAllTiles] = useState([]);
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
  const [target, setTarget] = useState(calcTarget(0));
  const [activeTile, setActiveTile] = useState(null);
  const [words, setWords] = useState([[]]);
  const bonusSpacesRef = useRef([{ id: `${Math.floor(gridSizeY / 2)},${Math.floor(gridSizeX / 2)}`, bonus: 'BDW' }]);
  const [blankPickerOpen, setBlankPickerOpen] = useState(false);
  const turnScores = useRef([]);
  const [totalScore, setTotalScore] = useState(0);
  const [turnScore, setTurnScore] = useState(null);
  const scoreTimeouts = useRef([]);
  const scoreCount = useRef(0);
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
  const [jokers, setJokers] = useState([]); // <Joker joker={JOKERS[4]} id={JOKERS[4].id} />,<Joker joker={JOKERS[7]} id={JOKERS[7].id} />
  const [maxJokers, setMaxJokers] = useState(5);

  const scoreWord = useCallback((word, scoreRound) => {
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
    scoreTimeouts.current.push(setTimeout(() => {
      setScoringTiles((old) => [...old, { id: word.tiles[0]?.props?.id, score: word?.valid ? baseScore : -baseScore, scoreRound, placement: word.orientation === 'horizontal' ? 'left' : 'top' }]);
      setTurnScore((old) => (old ?? 0) + (word?.valid ? baseScore : -baseScore));
      setTimeout(() => {
        setScoringTiles((old) => old.filter((t) => t.id !== word.tiles[0]?.props?.id || t.placement !== (word.orientation === 'horizontal' ? 'left' : 'top') || t.scoreRound !== scoreRound));
      }, 1000);
    }, (scoreCount.current++) * 500));
    return baseScore;
  }, [gridArray, setScoringTiles]);

  const getGlobalJokers = useCallback(() => {
    return jokers.filter((j) => j.props?.joker?.global);
  }, [jokers]);

  const score = useCallback((newWords, scoreRound = 0) => {
    const validScore = newWords.filter((w) => w.valid).reduce((acc, w) => acc + scoreWord(w, scoreRound), 0);
    const invalidScore = newWords.filter((w) => !w.valid).reduce((acc, w) => acc + scoreWord(w, scoreRound), 0);
    let currentScore = validScore - invalidScore;
    jokers.filter((j) => j.action).forEach((j) => {
      const { newScore, newMoney, delta } = j.props?.joker?.action?.({ words: [...words, newWords], grid: gridArray, totalScore: currentScore, validScore, invalidScore, target, funds }) ?? { newScore: currentScore, newMoney: 0, delta: 0 };
      scoreTimeouts.current.push(setTimeout(() => {
        setScoringTiles((old) => [...old, { id: j.props?.id, score: delta, placement: 'bottom', newMoney: newMoney ?? 0, scoreRound }]);
        setTurnScore((old) => (old ?? 0) + delta);
        setTimeout(() => {
          setScoringTiles((old) => old.filter((t) => t.id !== j.props?.id || t.scoreRound !== scoreRound));
        }, 1000);
      }, (scoreCount.current++) * 500));
      currentScore = newScore;
      setFunds((old) => old + (newMoney ?? 0));
    });
    turnScores.current[currentTurnRef.current] = currentScore;
    return currentScore;
  }, [funds, gridArray, jokers, scoreWord, setScoringTiles, target, words]);

  const start = useCallback(() => {
    setRetrieving([]);
    scoreTimeouts.current = [];
    scoreCount.current = 0;
    tilesOnBoard.current = [];
    initialPositions.current = {};
    const ttd = tilesToDrawRef.current + (getGlobalJokers().reduce((acc, j) => acc + (j.props?.joker?.global?.draws ?? 0), 0));
    const newAllTiles = shuffle(tileLibrary.current).map((l) => <Tile key={l.id} letter={l} id={l.id} dealable />);
    const drawn = newAllTiles.slice(0, ttd);
    setBag(newAllTiles.length - ttd);
    setAvailableTiles(drawn);
    setAllTiles(newAllTiles.slice(ttd));
    setTrayArray(drawn);
    setBagTiles(drawn.map((t) => t.props.id));
    setDealing(true);
    setTurns(3 + (getGlobalJokers().reduce((acc, j) => acc + (j.props?.joker?.global?.turns ?? 0), 0)));
    setSwaps(3 + (getGlobalJokers()?.reduce((acc, j) => acc + (j.props?.joker?.global?.swaps ?? 0), 0)));
    setSwapArray([]);
    currentTurnRef.current = 0;
    setCurrentTurn(1)
    setTotalScore(0);
    setWords([[]])
    turnScores.current = [];
    setTarget(calcTarget(round + 1));
    setRound((old) => old + 1);
    setGridArray(() => Array(gridSizeY).fill().map((_row, r) => Array(gridSizeX).fill().map((_col, c) => {
      const bonusSpace = bonusSpacesRef.current.find((b) => {
        const [row, col] = b.id.split(',').map((n) => parseInt(n));
        return row === r && col === c;
      });
      return { id: `${r},${c}`, tile: null, bonus: bonusSpace?.bonus ?? null }
    })));
  }, [setRetrieving, getGlobalJokers, setBagTiles, setDealing, round, gridSizeY, gridSizeX]);

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
          newFoundWords.push({ word, valid, score: scr, tiles: wordTiles, orientation: 'horizontal' });
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
          newFoundWords.push({ word, valid, score: scr, tiles: wordTiles, orientation: 'vertical' });
        }
      });
    }
    // Find tiles with no neighbours
    gridArray.forEach((row, i) => {
      row.forEach((col, j) => {
        if (col.tile && !gridArray[i][j - 1]?.tile && !gridArray[i][j + 1]?.tile && !gridArray[i - 1]?.[j]?.tile && !gridArray[i + 1]?.[j]?.tile) {
          if (!fixedTiles.includes(col.tile.props.id)) {
            newFoundWords.push({ word: col.tile.props.letter.letter, valid: false, score: col.tile.props.letter.value, tiles: [col.tile], orientation: 'vertical' });
          }
        }
      });
    });

    return newFoundWords;
  }, [blanks, fixedTiles, gridArray]);

  const endTurn = useCallback(() => {
    setTurnOver(true);
    const newWords = checkForWords();
    let newTurnScore = score(newWords);
    const thisTurn = currentTurnRef.current;
    let numJokers = 0;
    if (thisTurn === turns - 1) {
      numJokers = getGlobalJokers()?.filter((j) => j.props?.joker?.global?.rescore).length;
      getGlobalJokers()?.filter((j) => j.props?.joker?.global?.rescore).forEach((j, i) => {
        scoreTimeouts.current.push(setTimeout(() => {
          setScoringTiles((old) => [...old, { id: j.props?.id, placement: 'bottom', scoreRound: i, text: 'Again!' }]);
          setTimeout(() => {
            setScoringTiles((old) => old.filter((t) => t.id !== j.props?.id || t.scoreRound !== i));
          }, 1000);
          newTurnScore += score(newWords, i + 1);
        }, (scoreCount.current++) * 500));
      });
    } else {
      
    }
    const newTotalScore = totalScore + newTurnScore;
    const getNewTotalScore = () => totalScore + newTurnScore;
    setWords((old) => { old[thisTurn] = newWords; return old; })
    scoreTimeouts.current.push(setTimeout(() => {
      setTotalScore(getNewTotalScore());
      setTurnScore(null);
    }, (((scoreCount.current * 500) + (1000 * (numJokers + 1))))));
    const newFixedTiles = [];
    gridArray.forEach((row) => row.forEach((col) => {
      if (col.tile) {
        newFixedTiles.push(col.tile.props.id);
        tilesOnBoard.current.push(col.tile.props.id);
      }
    }));
    setFixedTiles(newFixedTiles);

    currentTurnRef.current++;
      if (newTotalScore < target && currentTurnRef.current < turns) {
        scoreTimeouts.current.push(setTimeout(() => {
          setCurrentTurn((old) => old + 1);
          const ttd = (tilesToDrawRef.current + getGlobalJokers().reduce((acc, j) => acc + (j.props?.joker?.global?.draws ?? 0), 0)) - trayArray.length - swapArray.length;
          const drawn = allTiles.slice(0, ttd);
          setBag(allTiles.length - ttd);
          const newTray = [...trayArray, ...swapArray, ...drawn];
          setAvailableTiles(newTray);
          setAllTiles((old) => old.slice(ttd));
          setTrayArray(newTray);
          setBagTiles(drawn.map((t) => t.props.id));
          setDealing(true);
          setSwapArray([]);
          scoreTimeouts.current = [];
          scoreCount.current = 0;
          bonusSpacesRef.current.forEach((b) => {
            const [row, col] = b.id.split(',').map((n) => parseInt(n));
            setGridArray((old) => old.map((r, i) => r.map((c, j) => {
              if (i === row && j === col) {
                return { ...c, bonus: b.bonus };
              }
              return c;
            })));
          });
        }, ((scoreCount.current * 500) + (1000 * (numJokers + 1)) + 500)));
      } else {
        tilesOnBoard.current.push(...trayArray.map((t) => t.props.id));
        scoreTimeouts.current.push(setTimeout(() => {
          setRetrieving(tilesOnBoard.current);
          setGlobalRoundOver(true);
        }, ((scoreCount.current * 500) + (1000 * (numJokers + 1)) + 300)));
        // Round over
        scoreTimeouts.current.push(setTimeout(() => {
          if (getNewTotalScore() >= target) {
            setFixedTiles([]);
            setBlanks({});
            setAllTiles(tileLibrary.current);
            setRoundOver(true);
            setGlobalRoundOver(false);
            scoreTimeouts.current = [];
            scoreCount.current = 0;
          } else {
            setGameOver(true);
            setGlobalRoundOver(false);
            scoreTimeouts.current = [];
            scoreCount.current = 0;
          }
        }, ((scoreCount.current * 500) + (1000 * (numJokers + 1)) + 1000)));
        
      }
  }, [allTiles, checkForWords, getGlobalJokers, gridArray, score, setBagTiles, setBlanks, setDealing, setFixedTiles, setGlobalRoundOver, setRetrieving, setScoringTiles, setTurnOver, swapArray, target, totalScore, trayArray, turns]);

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
      setBlanks((old) => ({ ...old, [activeTile.props.id]: undefined }));
      setSwapArray((old) => [...old, activeTile]);
    } else {
      setBlanks((old) => ({ ...old, [activeTile.props.id]: undefined }));
      setTrayArray((old) => [...old, activeTile]);
    }
  }, [activeTile, setBlanks]);

  const submitDisabled = useMemo(() => {
    return !gridArray.flat().some((t) => t.tile && !fixedTiles.includes(t.tile.props.id));
  }, [fixedTiles, gridArray]);

  
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
      const newTile = { ...tile, ...upgrade, value: tile.value + upgrade.adder, id: tile.id };
      tileLibrary.current = tileLibrary.current.filter((t) => t.id !== tile.id);
      tileLibrary.current.push(newTile);
      setInventory((old) => old.filter((t) => t.props.item.id !== upgrade.id));
      return newTile;
    }
    return tile;
  }, []);

  const handleDragInventoryEnd = useCallback((event) => {
    if (event.over?.id != null && event.over.id >=0 && event.over.id < 7 && activeInventory.props.item.placement === 'tile') {
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
    const interest = Math.floor(funds * 0.1);
    const base = 3;
    const remainingTurns = turns - currentTurn;
    const remainingSwaps = swaps;
    const wordScore = words.flat().filter((w) => w.valid).length <= turns - remainingTurns ? 5 : 0;

    return {
      base,
      turns: remainingTurns,
      swaps: remainingSwaps,
      words: wordScore,
      interest,
      total: base + remainingTurns + remainingSwaps + wordScore + interest,
    }
  }, [currentTurn, funds, swaps, turns, words]);

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
    newAvailableUpgradeTiles.push({ key, ...BONUSES[bonusKey], ...BONUS_LETTERS[key], value: (BONUSES[bonusKey].adder ?? 0) + BONUS_LETTERS[key].value, name: `${BONUSES[bonusKey].name} - ${BONUS_LETTERS[key].letter}`, price: Math.floor((BONUS_LETTERS[key].price ?? BONUS_LETTERS[key].value) - 2 + BONUSES[bonusKey].price), id: v4() });
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
    scoreTimeouts.current = [];
    scoreCount.current = 0;
    const newGridSize = 7;
    setGridSizeY(newGridSize);
    setGridSizeY(newGridSize);
    setInventory([]);
    tilesToDrawRef.current = 13;
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
      setSwapTiles(swapArray.map((t) => t.props.id));
      setTimeout(() => {
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
        setBagTiles(drawn.map((t) => t.props.id));
        setDealing(true);
        setSwapArray([]);
        setSwapTiles([]);
        setSwaps((old) => old - 1);
      }, 600 + (swapArray.length * 100));
    }
  }, [swaps, setSwapTiles, swapArray, allTiles, trayArray, gridArray, setBagTiles, setDealing])

  const steps = useMemo(() => [
    {
      selector: '.tray',
      content: 'This is your tray. Drag tiles from here to the board to make words.',
    },
    {
      selector: '.board',
      content: 'This is the board. Drag tiles from your tray to the board to make words. Words must be left-to-right or top-to-bottom.',
    },
    {
      selector: '.target',
      content: 'This is the target score for the round. You must beat this score to move on to the next round.',
    },
    {
      selector: '.end-turn',
      content: 'When you are done making words, click here to end your turn. You have three turns per round to try to reach the target.',
    },
    {
      selector: '.swapper',
      content: "If you don't like your letters, you can swap tiles from your tray for new ones. You have 3 swaps per round.",
    },
    {
      content: 'After each successful round you can buy upgrades in the shop. You can also buy jokers to help you increase your score.',
    },
  ], []);

  const shopSteps = useMemo(() => [
    {
      selector: '.shop',
      content: 'This is the shop. Spend your money here to buy upgrades and jokers.',
    },
    {
      selector: '.inventory',
      content: 'Your inventory shows purchased upgrades that have not yet been used.',
    },
    {
      selector: '.jokers',
      content: 'Jokers are used to add bonuses to your score. They are automatically activated at the end of each turn, in order from left to right.',
    },
    {
      selector: '.upgrades',
      content: 'Upgrades are used to make tiles or the board better. Some upgrades can be placed on a tile, others go on the board.',
    },
    {
      selector: '.tiles',
      content: "You can also purchase new tiles to add to your stock. One tile will be available pre-upgraded.",
    },
  ], []);

  const shouldTour = useMemo(() => !user?.didTour, [user]);

  const shouldShopTour = useMemo(() => shopOpen && !user?.didShopTour, [shopOpen, user?.didShopTour]);

  const handleShare = useCallback(async () => {
    let url = document.location.href;
    const shareDetails = { title: 'Glyphoria', text: `🟫 I beat ${round - 1} rounds with ${totalScore} points using ${words.flat().length} words on Glyphoria! 🟫 ${url}`  }
    if (navigator.share) {
      try {
        await navigator.share(shareDetails);
      } catch (error) {
        console.error(error);
      }
    }
  }, [round, totalScore, words]);

  const getAllTiles = useCallback(() => {
    return [...tileLibrary.current].sort((a, b) => a.letter.localeCompare(b.letter));
  }, []);

  const availableFunds = useMemo(() => (funds ?? 0) + (getGlobalJokers().reduce((acc, j) => acc + (j.props?.joker?.global?.debt ?? 0), 0)), [funds, getGlobalJokers]);

  if (!gameStarted) {
    return (
      <>
      {/* <Box className="glow" sx={{ color: 'white', position: 'relative', height: 9000, width: 2000, m: 4,  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '72px', fontFamily: 'Orbitron' }}>
        Glyphoria
      </Box> */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, boxSizing: 'border-box' }}>
        <Box className="glow" sx={{ fontSize: '56px', mt: 4, textAlign: 'center', fontFamily: '"Orbitron", serif', fontWeight: 400, color: 'white' }}>
          Glyphoria
        </Box>
        <Box sx={{ fontSize: '18px', mt: 2, textAlign: 'center' }}>
          The object of the game is to make a crossword grid on the board with a high enough total score to beat the target.<br /><strong>Words must be left-to-right or top-to-bottom</strong>.
        </Box>
        <Box sx={{ fontSize: '18px', mt: 1, color: '#8a1e39', textAlign: 'center' }}>
          WARNING: Invalid words will be penalized!
        </Box>
        <Box sx={{ fontSize: '18px', mt: 1, textAlign: 'center' }}>
          You have 3 turns to attempt this. Each turn will give you more letters.
        </Box>
        <Box sx={{ fontSize: '18px', mt: 1, textAlign: 'center' }}>
          After each round you will earn money which you can spend in the shop to buy upgrades for the following rounds.
        </Box>
        <Box sx={{ fontSize: '18px', mt: 2, textAlign: 'center' }}>
          Click the button below to start the game.
        </Box>
        <Box sx={{ mt: 4 }}>
          <Button className="button" variant="contained" onClick={() => { start(); setGameStarted(true); } }>
            Start Game
          </Button>
        </Box>
      </Box>
      </>
    );
  }

  return (
    <>
      <Dialog open={roundOver}>
        <DialogTitle sx={{ fontFamily: 'Orbitron' }}>Round Over</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ fontSize: '24px', mt: 2, fontFamily: 'Orbitron' }}>Round {round} Defeated!</Box>
            <Box sx={{ fontSize: '24px', mt: 2, color: '#11adab', fontFamily: 'Orbitron' }}>Total Score: {totalScore}/{target}</Box>
      
              <Box sx={{ width: '100%', fontSize: '24px', mt: 2, color: 'goldenrod', display: 'flex', justifyContent: 'space-between', fontFamily: 'Orbitron' }}><span>Money Earned:</span><span>+${getNewFunds().total}</span></Box>
              <Divider />
              <Box sx={{  width: '100%', fontSize: '16px', mt: 1, color: 'goldenrod', display: 'flex', justifyContent: 'space-between', fontFamily: 'Orbitron' }}><span>Base:</span><span>+${getNewFunds().base}</span></Box>
              <Box sx={{  width: '100%', fontSize: '16px', mt: 1, color: 'goldenrod', display: 'flex', justifyContent: 'space-between', fontFamily: 'Orbitron' }}><span>Remaining Turns:</span><span>+${getNewFunds().turns}</span></Box>
              <Box sx={{  width: '100%', fontSize: '16px', mt: 1, color: 'goldenrod', display: 'flex', justifyContent: 'space-between', fontFamily: 'Orbitron' }}><span>Remaining Swaps:</span><span>+${getNewFunds().swaps}</span></Box>
              <Box sx={{  width: '100%', fontSize: '16px', mt: 1, color: 'goldenrod', display: 'flex', justifyContent: 'space-between', fontFamily: 'Orbitron' }}><span>Word bonus:</span><span>+${getNewFunds().words}</span></Box>
              <Box sx={{  width: '100%', fontSize: '16px', mt: 1, color: 'goldenrod', display: 'flex', justifyContent: 'space-between', fontFamily: 'Orbitron' }}><span>Interest:</span><span>+${getNewFunds().interest}</span></Box>
          </Box>
          <Box sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Button className="button" variant="contained" onClick={handleOpenShop}>Open Shop</Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog open={shopOpen}>
        <DialogTitle sx={{ fontFamily: 'Orbitron' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', fontFamily: 'Orbitron' }}>
            <Typography variant='h5' sx={{ fontFamily: 'Orbitron' }}>Shop!</Typography>
            <Typography variant='h5' sx={{ color: 'goldenrod', fontFamily: 'Orbitron' }}>${funds}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent className="shop" sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>Inventory</Typography>
          <Box className="inventory" sx={{ minHeight: 50, mb: 2, p: 1, backgroundColor: 'gainsboro', border: '1px solid lightgrey', borderRadius: '8px' }}>
            {inventoryItems}
          </Box>
          <Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>Available Jokers</Typography>
          <Box className="jokers" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', mt: -2 }}>	
              {availableJokers.map((u) => (
                <Box key={u.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', position: 'relative', p: 2, m: matches ? 1 : 2, maxWidth: '30%' }}>
                  {
                    u.disabled && <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', zIndex: 5 }} />
                  }
                  <Joker joker={u} id={u.id} />
                  <Typography variant='h6' sx={{ textAlign: 'center', fontSize: matches ? 18 : 20, fontFamily: 'Orbitron' }}>{u.name}</Typography>
                  <Typography variant='body1' sx={{ textAlign: 'center', fontSize: matches ? 14 : 16 }}>{u.description}</Typography>
                  <Typography variant='body1' sx={{ mt: 'auto', color: 'goldenrod', fontFamily: 'Orbitron' }}>Price: ${u.price}</Typography>
                  <Button sx={{ fontFamily: 'Orbitron' }} disabled={u.disabled || availableFunds < u.price || jokers.length >= maxJokers} onClick={() => {
                    if (availableFunds >= u.price) {
                      setFunds((old) => old - u.price);
                      setJokers((old) => [...old, <Joker joker={u} id={u.id} />]);
                      setAvailableJokers((old) => old.map((a) => ({ ...a, disabled: a.id === u.id })));
                    }
                  }}>Buy</Button>
                </Box>
              ))}
            </Box>
          </Box>
          <Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>Available Upgrades</Typography>
          <Box className="upgrades" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', mt: -2 }}>	
              {availableUpgrades.map((u) => (
                <Box key={u.id} sx={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', position: 'relative', p: 2, m: 2, ...u.style }}>
                  {
                    u.disabled && <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', zIndex: 5 }} />
                  }
                  <Typography variant='h6' sx={{ fontFamily: 'Orbitron' }}>{u.name}</Typography>
                  <Typography variant='body1' sx={{ textAlign: 'center' }}>{u.description}</Typography>
                  <Typography variant='body1' sx={{ color: 'goldenrod', fontFamily: 'Orbitron', mt: 'auto', textAlign: 'center', width: u.description ? 145 : 'auto', background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 20%, rgba(255,255,255,0.5) 80%, rgba(255,255,255,0) 100%)' }}>Price: ${u.price}</Typography>
                  <Button sx={{ fontFamily: 'Orbitron' }} disabled={u.disabled || availableFunds < u.price} onClick={() => {
                    if (availableFunds >= u.price) {
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
          <Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>Available Tiles</Typography>
          <Box className="tiles" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', mt: matches ? -1 : -2 }}>	
              {availableUpgradeTiles.map((u) => (
                <Box key={u.id} sx={{ display: 'flex', width: u.description ? '100%' : 'auto', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', position: 'relative', p: matches ? 1 : 2, m: matches ? 0 : 2, ...u.style }}>
                  {
                    u.disabled && <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', zIndex: 5 }} />
                  }
                  <Tile letter={u} id={u.id} />
                  { u.name && <Typography variant='h6' sx={{ fontFamily: 'Orbitron' }}>{u.name}</Typography> }
                  { u.description && <Typography variant='body1' sx={{ textAlign: 'center' }}>{u.description}</Typography> }
                  <Typography variant='body1' sx={{ color: 'goldenrod', fontFamily: 'Orbitron', mt: 'auto', textAlign: 'center', width: u.description ? 145 : 'auto', background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 20%, rgba(255,255,255,0.5) 80%, rgba(255,255,255,0) 100%)' }}>Price: ${u.price}</Typography>
                  <Button sx={{ fontFamily: 'Orbitron' }} disabled={u.disabled || availableFunds < u.price} onClick={() => {
                    if (availableFunds >= u.price) {
                      setFunds((old) => old - u.price);
                      tileLibrary.current.push(u);
                      setAvailableUpgradeTiles((old) => old.map((a) => ({ ...a, disabled: a.id === u.id })));
                    }
                  }}>Buy</Button>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <Box sx={{ my: 2, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Button className="button" variant="contained" onClick={handlePlacement}>{inventory.length ? 'Continue' : 'Next Round'}</Button>
        </Box>
      </Dialog>
      <Dialog open={placementOpen}>
        <DialogTitle sx={{ fontFamily: 'Orbitron' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography variant='h5'>Shop!</Typography>
            <Typography variant='h5' sx={{ color: 'goldenrod' }}>${funds}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>Inventory</Typography>
          <Typography variant='body1' sx={{ fontFamily: 'Orbitron' }}>Drag upgrades to the board or tiles to improve them.</Typography>
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
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', scale: matches ? 0.75 : 1 }}>
                <Edge side="top" />
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Edge side="left" />
                  <Grid gridArray={inventoryGridArray} />
                  <Edge side="right" />
                </Box>
                <Edge side="bottom" />
              </Box>
          </DndContext>
        </DialogContent>
        <Box sx={{ my: 2, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Button className="button" variant="contained" onClick={handleNextRound}>Next Round</Button>
          </Box>
      </Dialog>
      <Dialog open={gameOver}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ fontSize: '24px', mt: 2, fontFamily: 'Orbitron' }}>Game Over</Box>
            <Box sx={{ fontSize: '24px', mt: 2 }}>You beat <span style={{ fontFamily: 'Orbitron', color: '#11adab' }}>{round - 1}</span> rounds</Box>
            <Box sx={{ fontSize: '24px', mt: 2, color: '#8a1e39', fontFamily: 'Orbitron' }}>Total Score: {totalScore}/{target}</Box>
            <Box sx={{ mt: 2 }}>
              { navigator.share ? (<Button className="button" variant="contained" sx={{ mr: 1 }} onClick={handleShare}><ShareIcon /> Share</Button>) : null }
              <Button className="button" variant="contained" onClick={handleGameOver}>Start Over</Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: matches ? '200px' : "250px", mb: matches ? '260px' : undefined }}>
          <BlankPicker open={!!blankPickerOpen} handleClick={handleBlank} />
          {
            jokers?.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: matches ? 100 : 120, left: '50%', transform: 'translateX(-50%)', p: 2, border: '1px solid ghostwhite', backgroundColor: '#564c59', borderRadius: '8px', zIndex: 5 }}>
                {
                  Array(maxJokers).fill().map((_, i) => (
                    <JokerSpace key={i} joker={jokers[i] ?? null} />
                  ))
                }
              </Box>
            )
          }
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Box className="board" sx={{ position: 'relative' }}>
            {/* scale: matches ? 0.6 : 1 */}
              <Grid gridArray={gridArray} />
            </Box>
          </Box>
          <Box sx={{ zIndex: 3, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', position: 'fixed', bottom: 0, mb: matches ? 0 : 2, left: '50%', transform: 'translateX(-50%)', flexWrap: 'wrap' }}>
            <InfoPanel swaps={swaps} turn={currentTurn} turns={turns} money={funds} />
            <Tray tiles={trayArray} />
            <Swapper tiles={swapArray} handleSwap={handleSwap} swaps={swaps} />
          </Box>
          <DragOverlay>
            { activeTile }
          </DragOverlay>
          <Box sx={{ zIndex: 3, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', position: 'fixed', top: 0, mt: matches ? 0 : 2, left: '50%', transform: 'translateX(-50%)', flexWrap: 'wrap' }}>
            <Bag bag={bag} getAllTiles={getAllTiles} allTiles={allTiles} />
            <Score score={totalScore} target={target} round={round} turnScore={turnScore} />
            <Submit onSubmit={endTurn} disabled={submitDisabled} />
          </Box>
        </Box>
      </DndContext>
      {
        shouldTour && (
          <Tour
            steps={steps}
            isOpen
            onRequestClose={() => setDidTour(true)}
            accentColor="#ff4da6"
            lastStepNextButton={<Button className="button" variant="contained" onClick={() => setDidTour(true)}>Start Game</Button>}	
          />
        )
      }
      {
        shouldShopTour && (
          <Tour
            steps={shopSteps}
            isOpen
            onRequestClose={() => setDidShopTour(true)}
            accentColor="#ff4da6"
            lastStepNextButton={<Button className="button" variant="contained" onClick={() => setDidTour(true)}>Let's Shop!</Button>}	
          />
        )
      }
    </>
    
  );
};

export default App;
