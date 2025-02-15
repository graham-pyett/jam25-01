import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DndContext, DragOverlay, useSensor, PointerSensor, useSensors } from "@dnd-kit/core";
import Tour from 'reactour'
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Typography, useMediaQuery } from '@mui/material';
import MuiGrid from '@mui/material/Grid2';
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
import { calcTarget, useGameData } from "../providers/GameDataProvider";
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
import Blank from "../components/Blank";
import Bomb from "../components/Bomb";

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
  const {
    blanks, setBlanks,
    setFixedTiles, fixedTiles,
    setScoringTiles,
    setDealing, dealing,
    setBagTiles, 
    setRoundOver: setGlobalRoundOver, 
    setTurnOver, turnOver, 
    setRetrieving, 
    setSwapTiles, 
    shopOpen, setShopOpen, 
    activeJoker, setActiveJoker,
    gridSizeY, setGridSizeY,
    gridSizeX, setGridSizeX,
    tileLibrary, setTileLibrary,
    funds, setFunds,
    target, setTarget,
    bonusSpaces, setBonusSpaces,
    round, setRound,
    inventory, setInventory,
    jokers, setJokers,
    maxJokers, setMaxJokers,
    gameStarted, setGameStarted,
    loadGame, clearGame, savedGame } = useGameData();
  const tilesToDrawRef = useRef(13);
  const tilesOnBoard = useRef([]);
  const [allTiles, setAllTiles] = useState([]);
  const [bag, setBag] = useState(0);
  const [swaps, setSwaps] = useState(3);
  const [turns, setTurns] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(1);
  const currentTurnRef = useRef(0);
  const [availableTiles, setAvailableTiles] = useState([]);
  const [gridArray, setGridArray] = useState([[{ tile: null, bonus: null }]]);
  const [inventoryGridArray, setInventoryGridArray] = useState([[{ tile: null, bonus: null }]]);
  const [activeInventory, setActiveInventory] = useState(null);
  const [trayArray, setTrayArray] = useState(availableTiles);
  const [swapArray, setSwapArray] = useState([]);
  const [activeTile, setActiveTile] = useState(null);
  const [words, setWords] = useState([[]]);
  const [blankPickerOpen, setBlankPickerOpen] = useState(false);
  const turnScores = useRef([]);
  const [totalScore, setTotalScore] = useState(0);
  const [turnScore, setTurnScore] = useState(null);
  const [roundOver, setRoundOver] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [availableUpgrades, setAvailableUpgrades] = useState([]);
  const [availableUpgradeTiles, setAvailableUpgradeTiles] = useState([]);
  const [availableJokers, setAvailableJokers] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [possibleLetters, setPossibleLetters] = useState([]);
  const [bagOpen, setBagOpenRaw] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [jokerDelete, setJokerDelete] = useState(false);
  const [bonusDelete, setBonusDelete] = useState(null);
  const [didStart, setDidStart] = useState(false);
  const [roundUpdated, setRoundUpdated] = useState(false);

  const setBagOpen = useCallback((open) => {
    if (!open) {
      setIsSwapping(false);
    }
    setBagOpenRaw(open);
  }, []);

  const scoreWord = useCallback(async (word, scoreRound) => {
    let baseScore = word.score || word.word.length;
    const bonuses = bonusSpaces.map((s) => ({ id: s.id, ...BONUSES[s.bonus] }));
    let newMoney = 0;
    // Tile bonuses first
    word.tiles.forEach((t) => {
      if (t.props.letter.adder) {
        baseScore += t.props.letter.adder;
      }
      if (t.props.letter.multiplier) {
        baseScore *= t.props.letter.multiplier;
      }
      if (t.props.letter.money) {
        newMoney += word.valid ? t.props.letter.money : -t.props.letter.money;
      }
    });
    // Board bonuses
    bonuses.filter((b) => b.scope === 'letter').forEach((b) => {
      const [row, col] = b.id.split(',').map((n) => parseInt(n));
      const tile = gridArray[row][col]?.tile?.props;
      if (tile && word.tiles.find((t) => t.props.id === tile?.id)) {
        baseScore += b.adder;
        if (b.multiplier) {
          baseScore -= tile.letter.value;
          baseScore += tile.letter.value * b.multiplier;
        }
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
    return new Promise((resolve) => setTimeout(async () => {
      setFunds((old) => old + newMoney);
      setScoringTiles((old) => [...old, { id: word.tiles[0]?.props?.id, score: word?.valid ? baseScore : -baseScore, scoreRound, placement: word.orientation === 'horizontal' ? 'left' : 'top', newMoney }]);
      setTimeout(() => {
        setScoringTiles((old) => old.filter((t) => t.id !== word.tiles[0]?.props?.id || t.placement !== (word.orientation === 'horizontal' ? 'left' : 'top') || t.scoreRound !== scoreRound));
      }, 1000);
      await new Promise((res) => setTimeout(() => { setTurnScore((old) => (old ?? 0) + (word?.valid ? baseScore : -baseScore)); res(); }, Math.max(500 - (scoreRound * 200), 100)));
      resolve(baseScore);
    }, Math.max(500 - (scoreRound * 200), 200)));
  }, [bonusSpaces, gridArray, setFunds, setScoringTiles]);

  const getGlobalJokers = useCallback(() => {
    return jokers.filter((j) => j.props?.joker?.global);
  }, [jokers]);

  const choosy = useMemo(() => !!getGlobalJokers().find((j) => j.props?.joker?.global?.choosy), [getGlobalJokers]);
 
  const score = useCallback(async (newWords, scoreRound = 0) => {
    const validScore = await newWords.filter((w) => w.valid).reduce(async (promise, w) => promise.then(async (last) => last + await scoreWord(w, scoreRound)), Promise.resolve(0));
    const invalidScore = await newWords.filter((w) => !w.valid).reduce(async (promise, w) => promise.then(async (last) => last + await scoreWord(w, scoreRound)), Promise.resolve(0));
    let currentScore = validScore - invalidScore;
    for (let j of jokers.filter((j) => j.props?.joker?.action)) {
      const { newScore, newMoney, delta } = j.props?.joker?.action?.({ words: [...words, newWords], grid: gridArray, totalScore: currentScore, validScore, invalidScore, target, funds, tray: trayArray }) ?? { newScore: currentScore, newMoney: 0, delta: 0 };
      currentScore = await new Promise((resolve) => setTimeout(async () => {
          setScoringTiles((old) => [...old, { id: j.props?.id, score: delta, placement: 'bottom', newMoney: newMoney ?? 0, scoreRound }]);
          setFunds((old) => old + (newMoney ?? 0));
          setTimeout(() => {
            setScoringTiles((old) => old.filter((t) => t.id !== j.props?.id || t.scoreRound !== scoreRound));
          }, 1000);
          await new Promise((res) => setTimeout(() => { setTurnScore((old) => (old ?? 0) + delta); res(); }, Math.max(500 - (scoreRound * 200), 100)));
          resolve(newScore);
        }, Math.max(500 - (scoreRound * 200), 200))
      );
    }
    turnScores.current[currentTurnRef.current] = currentScore;
    return currentScore;
  }, [funds, gridArray, jokers, scoreWord, setFunds, setScoringTiles, target, trayArray, words]);

  const start = useCallback(() => {
    setRetrieving([]);
    tilesOnBoard.current = [];
    const ttd = tilesToDrawRef.current + (getGlobalJokers().reduce((acc, j) => acc + (j.props?.joker?.global?.draws ?? 0), 0));
    const newAllTiles = shuffle(tileLibrary).map((l) => <Tile key={l.id} letter={l} id={l.id} dealable />);
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
    setTarget(calcTarget(round));
    setGridArray(() => Array(gridSizeY).fill().map((_row, r) => Array(gridSizeX).fill().map((_col, c) => {
      const bonusSpace = bonusSpaces.find((b) => {
        const [row, col] = b.id.split(',').map((n) => parseInt(n));
        return row === r && col === c;
      });
      return { id: `${r},${c}`, tile: null, bonus: bonusSpace?.bonus ?? null }
    })));
  }, [setRetrieving, getGlobalJokers, tileLibrary, setBagTiles, setDealing, setTarget, round, gridSizeY, gridSizeX, bonusSpaces]);

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
    for (let i = 0; i < gridSizeX; i++) {
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
  }, [blanks, fixedTiles, gridArray, gridSizeX]);

  const endTurn = useCallback(async () => {
    setTurnOver(true);
    const newWords = checkForWords();
    let newTurnScore = await score(newWords);
    const thisTurn = currentTurnRef.current;
    if (thisTurn === turns - 1) {
      await Promise.all(getGlobalJokers()?.filter((j) => j.props?.joker?.global?.rescore).map(async (j, i) => {
        await new Promise((resolve) => setTimeout(async () => {
          setScoringTiles((old) => [...old, { id: j.props?.id, placement: 'bottom', scoreRound: i, text: 'Again!' }]);
          setTimeout(() => {
            setScoringTiles((old) => old.filter((t) => t.id !== j.props?.id || t.scoreRound !== i));
          }, 1000);
          newTurnScore += await score(newWords, i + 1);
          resolve();
        }, 500));
      }));
    }
    const newTotalScore = totalScore + newTurnScore;
    setWords((old) => { old[thisTurn] = newWords; return old; })
    await new Promise((resolve) => setTimeout(() => {
      setTotalScore(newTotalScore);
      setTurnScore(null);
      resolve();
    }, 1500));
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
        await new Promise((resolve) => setTimeout(() => {
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
          bonusSpaces.forEach((b) => {
            const [row, col] = b.id.split(',').map((n) => parseInt(n));
            setGridArray((old) => old.map((r, i) => r.map((c, j) => {
              if (i === row && j === col) {
                return { ...c, bonus: b.bonus };
              }
              return c;
            })));
          });
          resolve();
        }, 800));
      } else {
        tilesOnBoard.current.push(...trayArray.map((t) => t.props.id));
        await new Promise((resolve) => setTimeout(() => {
          setRetrieving(tilesOnBoard.current);
          setGlobalRoundOver(true);
          resolve();
        }, 300));
        // Round over
        await new Promise((resolve) => setTimeout(() => {
          if (newTotalScore >= target) {
            setFixedTiles([]);
            setBlanks({});
            // setAllTiles(tileLibrary.current);
            setRoundOver(true);
            setGlobalRoundOver(false);
          } else {
            setGameOver(true);
            clearGame();
            setGlobalRoundOver(false);
          }
          resolve();
        }, 800));
        
      }
  }, [clearGame, allTiles, bonusSpaces, checkForWords, getGlobalJokers, gridArray, score, setBagTiles, setBlanks, setDealing, setFixedTiles, setGlobalRoundOver, setRetrieving, setScoringTiles, setTurnOver, swapArray, target, totalScore, trayArray, turns]);

  const handleDragStart = useCallback((event) => {
    const newActiveTile = availableTiles.find((t) => t.props.id === event.active.id);
    setActiveTile(newActiveTile);
    setTrayArray((old) => {
      const oldIndex = old.findIndex((t) => t.props.id === event.active.id);
      const filtered = old.filter((t) => t.props.id !== event.active.id);
      filtered.splice(oldIndex, 0, <Blank key={`blank_space_${v4()}`} id={`blank_space_${v4()}`} />);
      return filtered;
    });
    setSwapArray((old) => old.filter((t) => t.props.id !== event.active.id));
    setGridArray((old) => old.map((r) => r.map((c) => {
      if (c.tile === newActiveTile) {
        return { ...c, tile: null };
      }
      return c;
    })));

  }, [availableTiles]);

  const handleDragMove = useCallback((event) => {
    if (activeTile) {
      if (event.over?.id && !event.over.id.startsWith('blank_space') && trayArray.map((t) => [`${t.props.id}-left`, `${t.props.id}-right`]).flat().includes(event.over.id)) {
        setTrayArray((old) => {
          const filtered = old.filter((t) => !t.props.id.startsWith('blank_space'));
          if (event.over.id.endsWith('-left')) {
            filtered.splice(filtered.findIndex((t) => `${t.props.id}-left` === event.over.id) + 1, 0, <Blank key={`blank_space_${v4()}`} id={`blank_space_${v4()}`} />);
          } else {
            filtered.splice(filtered.findIndex((t) => `${t.props.id}-right` === event.over.id), 0, <Blank key={`blank_space_${v4()}`} id={`blank_space_${v4()}`} />);
          }
          return filtered;
        });
      } else if (!event.over?.id?.startsWith('blank_space')) {
        setTrayArray((old) => old.filter((t) => !t.props.id.startsWith('blank_space')));
      }
    }
  }, [activeTile, trayArray]);

  const handleDragEnd = useCallback((event) => {
    let newTray = [...trayArray];
    if (activeTile) {
      if (event.over?.id && !event.collisions.map((c) => c.id).includes('tray') && !event.collisions.map((c) => c.id).includes('swapper') && !event.over.id.startsWith('blank_space') && !event.over.id.endsWith('-left') && !event.over.id.endsWith('-right')) {
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
      } else if (event.over?.id && event.collisions.map((c) => c.id).includes('swapper')) {
        setBlanks((old) => ({ ...old, [activeTile.props.id]: undefined }));
        setSwapArray((old) => [...old, activeTile]);
      } else if (event.over?.id && (event.over.id.startsWith('blank_space') || event.over.id.endsWith('-left') || event.over.id.endsWith('-right'))) {
        setBlanks((old) => ({ ...old, [activeTile.props.id]: undefined }));
        const blankInd = newTray.findIndex((t) => t.props.id.startsWith('blank_space'));
        newTray.splice(blankInd >= 0 ? blankInd : newTray.length, 1, activeTile);
        newTray = newTray.filter((t) => !t.props.id.startsWith('blank_space'));
      } else {
        setBlanks((old) => ({ ...old, [activeTile.props.id]: undefined }));
        newTray = [...newTray.filter((t) => !t.props.id.startsWith('blank_space')), activeTile];
      }
    }
    const uniqueTray = [...new Set(newTray.map((t) => t.props.id))];
    setTrayArray(newTray.filter((t) => uniqueTray.includes(t.props.id) && !t.props.id.startsWith('blank_space')));
  }, [activeTile, setBlanks, trayArray]);

  const handleDragJokerStart = useCallback((event) => {
    const newActiveJoker = jokers.find((t) => t.props.id === event.active.id);
    setActiveJoker(newActiveJoker);
    setJokers((old) => {
      const oldIndex = old.findIndex((t) => t.props.id === event.active.id);
      const filtered = old.filter((t) => t.props.id !== event.active.id);
      const blankId = `blank_space_${v4()}`;
      filtered.splice(oldIndex, 0, <Blank key={blankId} id={blankId} />);
      return filtered;
    });
  }, [jokers, setActiveJoker, setJokers]);

  const handleDragJokerMove = useCallback((event) => {
    if (activeJoker) {
      if (event.over?.id && !event.over.id.startsWith('blank_space') && jokers.map((t) => [`${t.props.id}-left`, `${t.props.id}-right`]).flat().includes(event.over.id)) {
        setJokers((old) => {
          const filtered = old.filter((t) => !t.props.id.startsWith('blank_space'));
          if (event.over.id.endsWith('-left')) {
            filtered.splice(filtered.findIndex((t) => `${t.props.id}-left` === event.over.id) + 1, 0, <Blank key={`blank_space_${v4()}`} id={`blank_space_${v4()}`} />);
          } else {
            filtered.splice(filtered.findIndex((t) => `${t.props.id}-right` === event.over.id), 0, <Blank key={`blank_space_${v4()}`} id={`blank_space_${v4()}`} />);
          }
          return filtered;
        });
      } else if (!event.over?.id?.startsWith('blank_space')) {
        setJokers((old) => old.filter((t) => !t.props.id.startsWith('blank_space')));
      }
    }
  }, [activeJoker, jokers, setJokers]);

  const handleDragJokerEnd = useCallback((event) => {
    let newJokers = [...jokers];
    if (activeJoker) {
      if (event.over?.id && (event.over.id.startsWith('blank_space') || event.over.id.endsWith('-left') || event.over.id.endsWith('-right'))) {
        const blankInd = newJokers.findIndex((t) => t.props.id.startsWith('blank_space'));
        newJokers.splice(blankInd >= 0 ? blankInd : newJokers.length, 1, activeJoker);
        newJokers = newJokers.filter((t) => !t.props.id.startsWith('blank_space'));
        setActiveJoker(null);
        const uniqueTray = [...new Set(newJokers.map((t) => t.props.id))];
        setJokers(newJokers.filter((t) => uniqueTray.includes(t.props.id) && !t.props.id.startsWith('blank_space')));
      } else if (event.over?.id && event.collisions.map((c) => c.id).includes('garbage')) {
        setJokerDelete(true);
      } else {
        newJokers = [...newJokers.filter((t) => !t.props.id.startsWith('blank_space')), activeJoker];
        const uniqueTray = [...new Set(newJokers.map((t) => t.props.id))];
        setJokers(newJokers.filter((t) => uniqueTray.includes(t.props.id) && !t.props.id.startsWith('blank_space')));
        setActiveJoker(null);
      }
    }
  }, [activeJoker, jokers, setActiveJoker, setJokers]);

  const submitDisabled = useMemo(() => {
    return dealing || turnOver || !gridArray.flat().some((t) => t.tile && !fixedTiles.includes(t.tile.props.id));
  }, [dealing, fixedTiles, gridArray, turnOver]);

  
  const handleDragInventoryStart = useCallback((event) => {
    if (event.active.id === 'bomb') {
      setActiveInventory(<Bomb />);
    } else {
      const newActiveInventory = inventory.find((t) => t.props.item.id === event.active.id);
      setActiveInventory(newActiveInventory);
      setInventoryItems((old) => [...old.filter((t) => t.props.item.id !== event.active.id)]);
      setInventoryGridArray((old) => old.map((r) => r.map((c) => {
        if (c.tile === newActiveInventory) {
          return { ...c, tile: null };
        }
        return c;
      })));
    }
  }, [inventory]);

  const handleUpgrade = useCallback((tile, upgrade) => {
    if (upgrade.placement === 'tile') {
      const newTile = { ...tile, ...upgrade, rarity: Math.min(Math.ceil((tile.rarity + upgrade.rarity) / 2), 3), value: tile.value + upgrade.adder, id: tile.id };
      setTileLibrary((old) => [...old.filter((t) => t.id !== tile.id), newTile]);
      setInventory((old) => old.filter((t) => t.props.item.id !== upgrade.id));
      return newTile;
    }
    return tile;
  }, [setInventory, setTileLibrary]);

  const handleDragInventoryEnd = useCallback((event) => {
    if (event.active.id === 'bomb') {
      if (event?.over?.id != null) {
        const found = event.collisions.map((c) => c.data?.droppableContainer?.data?.current).find((a) => a.accepts.includes('bomb'));
        if (found) {
          const bon = { ...BONUSES[found?.bonus], location: found?.placed };
          setBonusDelete(bon);
        }
      }
    } else if (event.over?.id != null && event.over.id >=0 && event.over.id < 7 && activeInventory.props.item.placement === 'tile') {
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
      const newBonusSpaces = bonusSpaces.map((b) => ({ ...b, id: `${b.id.split(',')[0]},${parseInt(b.id.split(',')[1]) + 1}` }));
      setBonusSpaces(newBonusSpaces);
      const newInventoryGridArray = Array(gridSizeY).fill().map((_row, r) => Array(newGridX).fill().map((_col, c) => {
        const bonusSpace = newBonusSpaces.find((b) => {
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
        const bonusSpace = bonusSpaces.find((b) => {
          const [row, col] = b.id.split(',').map((n) => parseInt(n));
          return row === r && col === c;
        });
        return { id: `${r},${c}`, tile: null, bonus: bonusSpace?.bonus ?? null }
      }));
      setInventoryGridArray(newInventoryGridArray);
    } else if (event.over?.id && event.over.id === 'top' && activeInventory.props.item.placement === 'edge') {
      const newGridY = gridSizeY + 1;
      setGridSizeY(newGridY);
      const newBonusSpaces = bonusSpaces.map((b) => ({ ...b, id: `${parseInt(b.id.split(',')[0]) + 1},${b.id.split(',')[1]}` }));
      setBonusSpaces(newBonusSpaces);
      const newInventoryGridArray = Array(newGridY).fill().map((_row, r) => Array(gridSizeX).fill().map((_col, c) => {
        const bonusSpace = newBonusSpaces.find((b) => {
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
        const bonusSpace = bonusSpaces.find((b) => {
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
  }, [activeInventory, handleUpgrade, gridSizeX, setGridSizeX, bonusSpaces, setBonusSpaces, gridSizeY, setGridSizeY]);


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
    setInventoryItems([...inventory]);
    const newAvailableUpgrades = [];
    const bonusesWithRarity = Object.keys(BONUSES).map((b) => Array(4 - BONUSES[b].rarity).fill({ ...BONUSES[b], key: b })).flat();
    for (let i = 0; i < 2; i++) {
      const keys = Object.keys(bonusesWithRarity);
      const key = keys[Math.floor(Math.random() * keys.length)];
      newAvailableUpgrades.push({ id: v4(), ...bonusesWithRarity[key] });
    }
    const newAvailableUpgradeTiles = [];
    const bonuseLettersWithRarity = BONUS_LETTERS.map((b) => Array(4 - b.rarity).fill(b)).flat();
    for (let i = 0; i < 3; i++) {
      const keys = Object.keys(bonuseLettersWithRarity);
      const key = keys[Math.floor(Math.random() * keys.length)];
      newAvailableUpgradeTiles.push({ key, ...bonuseLettersWithRarity[key], price: bonuseLettersWithRarity[key].price ?? bonuseLettersWithRarity[key].value, id: v4() });
    }
    const keys = Object.keys(bonuseLettersWithRarity);
    const key = keys[Math.floor(Math.random() * keys.length)];
    const filteredBonuses = bonusesWithRarity.filter((b) => b.placement === 'tile')
    const bonusKeys = Object.keys(filteredBonuses);
    const bonusKey = bonusKeys[Math.floor(Math.random() * bonusKeys.length)];
    const selectedBonus = filteredBonuses[bonusKey];
    const selectedLetter = bonuseLettersWithRarity[key];
    newAvailableUpgradeTiles.push({ key, ...selectedBonus, ...selectedLetter, rarity: Math.min(Math.ceil((selectedBonus.rarity + selectedLetter.rarity) / 2), 3), value: (selectedBonus.adder ?? 0) + selectedLetter.value, name: `${selectedBonus.name} - ${selectedLetter.letter}`, price: Math.floor((selectedLetter.price ?? selectedLetter.value) - 2 + selectedBonus.price), id: v4() });
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
  }, [getNewFunds, inventory, setFunds, setShopOpen]);
  
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
          setBonusSpaces((old) => [...old, { id: bonusId, bonus: i.props.item.key }]);
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
    setRound((old) => old + 1);
    setRoundUpdated(true);
  }, [inventory, inventoryGridArray, possibleLetters, setBonusSpaces, setInventory, setRound]);

  const handlePlacement = useCallback(() => {
    setShopOpen(false);
    if (inventory.length) {
      setInventoryItems([...inventory]);
      setPossibleLetters(shuffle(tileLibrary).slice(0, 7).map((l) => <Tile key={l.id} letter={l} id={l.id} />));
      setInventoryGridArray(() => Array(gridSizeY).fill().map((_row, r) => Array(gridSizeX).fill().map((_col, c) => {
        const bonusSpace = bonusSpaces.find((b) => {
          const [row, col] = b.id.split(',').map((n) => parseInt(n));
          return row === r && col === c;
        });
        return { id: `${r},${c}`, tile: null, bonus: bonusSpace?.bonus ?? null }
      })));
      
      setPlacementOpen(true);
    } else {
      handleNextRound();
    }
  }, [setShopOpen, inventory, tileLibrary, gridSizeY, gridSizeX, bonusSpaces, handleNextRound]);

  const handleNewGame = useCallback(() => {
    const newGridSize = 7;
    setGridSizeY(newGridSize);
    setGridSizeY(newGridSize);
    setInventory([]);
    tilesToDrawRef.current = 13;
    setGameOver(false);
    setRound(1);
    setJokers([]);
    setMaxJokers(5);
    setTileLibrary(getStarterLetters());
    setBonusSpaces([{ id: `${Math.floor(newGridSize / 2)},${Math.floor(newGridSize / 2)}`, bonus: 'BDW' }]);
    setGameStarted(false);
    setFunds(3);
    turnScores.current = [];
    setGameStarted(true);
  }, [setBonusSpaces, setFunds, setGameStarted, setGridSizeY, setInventory, setJokers, setMaxJokers, setRound, setTileLibrary]);

  useEffect(() => {
    if (gameStarted && !didStart) {
      start();
      setDidStart(true);
      setRoundUpdated(false);
    }
    if (!gameStarted && didStart) {
      setDidStart(false);
    }
    if (gameStarted && didStart && roundUpdated) {
      start();
      setRoundUpdated(false);
    }
  }, [didStart, gameStarted, start, roundUpdated]);

  const doSwap = useCallback((drawn) => {
    setBag(allTiles.length - drawn.length);
    const newTray = [...trayArray, ...drawn];
    const gridTiles = [];
    gridArray.forEach((row) => row.forEach((col) => {
      if (col.tile) {
        gridTiles.push(col.tile);
      }
    }));
    setAvailableTiles([...newTray, ...gridTiles]);
    setAllTiles((old) => old.filter((o) => !drawn.map((d) => d.props.id).includes(o.props.id)));
    setTrayArray(newTray);
    setBagTiles(drawn.map((t) => t.props.id));
    setDealing(true);
    setSwapArray([]);
    setSwapTiles([]);
    setSwaps((old) => old - 1);
  }, [allTiles.length, gridArray, setBagTiles, setDealing, setSwapTiles, trayArray]);

  const handleSwapChoice = useCallback((tile) => {
    if (choosy && isSwapping) {
      setBagOpenRaw(false);
      setSwapTiles(swapArray.map((t) => t.props.id));
      setTimeout(() => {
        const tileIndex = allTiles.findIndex((t) => t.props.id === tile.id);
        const drawn = allTiles.slice(tileIndex, tileIndex + 1);
        doSwap(drawn);
        setIsSwapping(false);
      }, 800);
    }
  }, [allTiles, choosy, doSwap, isSwapping, setSwapTiles, swapArray]);

  const handleSwap = useCallback(() => {
    if (swaps > 0 && swapArray.length) {
      if (choosy) {
        setIsSwapping(true);
        setBagOpen(true);
      } else {
        setSwapTiles(swapArray.map((t) => t.props.id));
        setTimeout(() => {
          const ttd = swapArray.length;
          const drawn = allTiles.slice(0, ttd);
          doSwap(drawn);
        }, 600);
      }
    }
  }, [allTiles, choosy, doSwap, setBagOpen, setSwapTiles, swapArray, swaps])

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5000
    }
  });

  const sensors = useSensors(pointerSensor);

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
    return [...tileLibrary].sort((a, b) => a.letter.localeCompare(b.letter));
  }, [tileLibrary]);

  const availableFunds = useMemo(() => (funds ?? 0) + (getGlobalJokers().reduce((acc, j) => acc + (j.props?.joker?.global?.debt ?? 0), 0)), [funds, getGlobalJokers]);

  const savedGameAvailable = useMemo(() => {
    if (!gameStarted) {
      return savedGame();
    }
  }, [gameStarted, savedGame]);

  if (!gameStarted) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, boxSizing: 'border-box' }}>
        <Box className="glow" sx={{ fontSize: '56px', mt: 4, mb: 2, textAlign: 'center', fontFamily: '"Orbitron", serif', fontWeight: 400, color: 'white' }}>
          Glyphoria
        </Box>
        <MuiGrid container spacing={2}>
          <MuiGrid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, boxSizing: 'border-box', borderRadius: 8, backgroundColor: 'rgba(189, 189, 189, 0.6)' }}>
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
          </MuiGrid>
          <MuiGrid size={{ xs: 12, md: 8 }} sx={{ borderRadius: 8, backgroundColor: 'rgba(189,189,189,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, boxSizing: 'border-box' }}>
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: 'lightgrey', borderRadius: 4 }}>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'whitesmoke', borderRadius: 4, mr: 1 }}>
                {
                  savedGameAvailable ? (
                    <>
                      <Typography variant='overline' sx={{ fontFamily: 'Orbitron', textAlign: 'center' }}>Saved Game</Typography>
                      <Typography variant='body1' sx={{ fontFamily: 'Orbitron', textAlign: 'center' }}>Round: {savedGameAvailable.round}</Typography>
                      <Box sx={{ mb: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', p: 2, border: '1px solid ghostwhite', backgroundColor: '#564c59', borderRadius: '8px', zIndex: 5 }}>
                        {
                          Array(savedGameAvailable?.maxJokers).fill().map((_, i) => (
                            <JokerSpace key={i} joker={savedGameAvailable?.jokers?.[i] ?? null} />
                          ))
                        }
                      </Box>
                    </>
                  ) : <Typography variant='overline' sx={{ fontFamily: 'Orbitron', mt: 'auto', textAlign: 'center' }}>No Saved Game Found</Typography>
                }
                <Button className="button" disabled={!savedGameAvailable} variant="contained" onClick={loadGame}>
                  Load Saved Game
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, borderRadius: 4 }}>
                <Typography variant='overline' sx={{ fontFamily: 'Orbitron', mt: 'auto', textAlign: 'center' }}>Start a new Game</Typography>
                <Button sx={{ mt: 'auto' }} className="button" variant="contained" onClick={handleNewGame}>
                  New Game
                </Button>
              </Box>
            </Box>
          </MuiGrid>
      </MuiGrid>
    </Box>
    );
  }

  return (
    <>
      <Dialog open={jokerDelete}>
        <DialogTitle sx={{ fontFamily: 'Orbitron' }}>Sell Joker?</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', position: 'relative', p: 2, m: matches ? 1 : 2 }}>
              {activeJoker}
              <Typography variant='h6' sx={{ textAlign: 'center', fontSize: matches ? 18 : 20, fontFamily: 'Orbitron' }}>{activeJoker?.props?.joker?.name}</Typography>
              <Typography variant='body1' sx={{ textAlign: 'center', fontSize: matches ? 14 : 16 }}>{activeJoker?.props?.joker?.description}</Typography>
              <Typography variant='body1' sx={{ mt: 'auto', color: 'goldenrod', fontFamily: 'Orbitron', textAlign: 'center' }}>Refund: ${Math.floor(activeJoker?.props?.joker?.price / 2)}</Typography>
            </Box>
          <Box sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Button className="button" variant="contained" sx={{ mr: 0.5 }} onClick={() => {
            const newJokers = [...jokers.filter((t) => !t.props.id.startsWith('blank_space')), activeJoker];
            setJokers(newJokers);
            setJokerDelete(false);
            setActiveJoker(null);
          }}>
                Cancel
            </Button>
            <Button className="button" variant="contained" sx={{ ml: 0.5 }} onClick={() => {
              setFunds((old) => old + Math.floor(activeJoker.props.joker.price / 2));
              setJokerDelete(false);
              setActiveJoker(null);
            }}>
                Sell
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog open={bonusDelete}>
        <DialogTitle sx={{ fontFamily: 'Orbitron' }}>Remove Bonus?</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', width: '80%', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', position: 'relative', m: 1, p: 2, ...bonusDelete?.style }}>
            <Typography variant='h6' sx={{ fontFamily: 'Orbitron' }}>{bonusDelete?.name}</Typography>
            <Typography variant='body1' sx={{ textAlign: 'center' }}>{bonusDelete?.description}</Typography>
            <Typography variant='body1' sx={{ color: 'goldenrod', fontFamily: 'Orbitron', mt: 'auto', textAlign: 'center', width: bonusDelete?.description ? 145 : 'auto', background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 20%, rgba(255,255,255,0.5) 80%, rgba(255,255,255,0) 100%)' }}>Refund: ${Math.floor(bonusDelete?.price / 2)}</Typography>
          </Box>
          <Box sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Button className="button" variant="contained" sx={{ mr: 0.5 }} onClick={() => {
              setBonusDelete(null);
            }}>
                Cancel
            </Button>
            <Button className="button" variant="contained" sx={{ ml: 0.5 }} onClick={() => {
              setFunds((old) => old + Math.floor(bonusDelete.price / 2));
              const row = parseInt(bonusDelete.location.split(',')[0]);
              const col = parseInt(bonusDelete.location.split(',')[1]);
              setInventoryGridArray((old) => old.map((r, i) => r.map((c, j) => {
                if (i === row && j === col) {
                  return {...c, bonus: null };
                }
                return c;
              })));
              setBonusSpaces((old) => old.filter((bs) => bs.id !== bonusDelete.location));
              setBonusDelete(null);
            }}>
                Sell
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
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
          <Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>Jokers</Typography>
          <DndContext sensors={sensors} onDragStart={handleDragJokerStart} onDragEnd={handleDragJokerEnd} onDragMove={handleDragJokerMove}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', p: 2, border: '1px solid ghostwhite', backgroundColor: 'gainsboro', borderRadius: '8px' }}>
              {
                Array(maxJokers).fill().map((_, i) => (
                  <JokerSpace key={i} id={v4()} joker={jokers[i] ?? null} />
                ))
              }
              <Box sx={{ ml: 1 }}>
                <JokerSpace isGarbage id={v4()} joker={null} />
              </Box>
            </Box>
            <DragOverlay>
              {activeJoker}
            </DragOverlay>
          </DndContext>
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
                      if (u.placement) {
                        setInventory((old) => [...old, <InventoryItem key={u.id} item={u} />]);
                      } else {
                        if (u.text === 'JOKER') {
                          setMaxJokers((old) => old + 1);
                        }
                      }
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
                      setTileLibrary((old) => [...old, u]);
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
          <DndContext sensors={sensors} onDragStart={handleDragInventoryStart} onDragEnd={handleDragInventoryEnd}>
              <Inventory items={inventoryItems} />
              <DragOverlay>
                {activeInventory}
              </DragOverlay>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mb: matches ? 0 : 2, flexWrap: 'wrap' }}>
                {
                  possibleLetters.map((l, i) => (
                    <InventoryTile key={i} tile={l} id={i} />
                  ))
                }
              </Box>
              <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', scale: matches ? 0.5 : 1, mt: matches ? -12 : 0 }}>
                <Box sx={{ position: 'absolute', top: 0, right: 0, width: 50, height: 50, borderRadius: 2, border: '1px solid slategrey', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, backgroungColor: 'whitesmoke' }}>
                  <Bomb />
                </Box>
                <Edge side="top" />
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Edge side="left" />
                  <Grid gridArray={inventoryGridArray} inventory />
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
              <Button className="button" variant="contained" onClick={() => setGameStarted(false)}>Start Over</Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragMove={handleDragMove}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: matches ? '200px' : "250px", mb: matches ? '300px' : undefined }}>
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
            <Swapper tiles={swapArray} choosy={choosy} handleSwap={handleSwap} swaps={swaps} />
          </Box>
          <DragOverlay>
            { activeTile }
          </DragOverlay>
          <Box sx={{ zIndex: 3, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', position: 'fixed', top: 0, mt: matches ? 0 : 2, left: '50%', transform: 'translateX(-50%)', flexWrap: 'wrap' }}>
            <Bag bagOpen={bagOpen} setBagOpen={setBagOpen} bag={bag} getAllTiles={getAllTiles} allTiles={allTiles} handleSwapChoice={handleSwapChoice} />
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
            lastStepNextButton={<Button className="button" variant="contained" onClick={() => setDidShopTour(true)}>Let's Shop!</Button>}	
          />
        )
      }
    </>
    
  );
};

export default App;
