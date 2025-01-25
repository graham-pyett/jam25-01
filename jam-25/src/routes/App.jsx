import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Box, Button } from '@mui/material';
import Score from "../components/Score";
import Grid from "../components/Grid";
import Tray from "../components/Tray";
import Tile from "../components/Tile";
import { getStarterLetters, shuffle } from "../letters";
import { checkValidWord } from "../words";

const App = () => {
  const [tilesToDraw, setTilesToDraw] = useState(13);
  const [gridSize, setGridSize] = useState(7);
  const [gameStarted, setGameStarted] = useState(false);
  const [allTiles, setAllTiles] = useState(shuffle(getStarterLetters().map((l) => <Tile key={l.id} letter={l} id={l.id} />)));
  const [availableTiles, setAvailableTiles] = useState([]);
  const [gridArray, setGridArray] = useState(Array(gridSize).fill(Array(gridSize).fill(null)));
  const [validArray, setValidArray] = useState(Array(gridSize).fill(Array(gridSize).fill('')));
  const [trayArray, setTrayArray] = useState(availableTiles);
  const [target, setTarget] = useState(100);
  const [activeTile, setActiveTile] = useState(null);
  const [words, setWords] = useState([]);

  console.log(words)

  const score = useMemo(() => {
    words.filter((w) => w.valid).forEach((w) => {
      w.coords?.length && w.coords?.forEach(([i, j]) => {
        setValidArray((old) => old.map((r, k) => r.map((c, l) => {
          if (k === i && l === j) {
            return 'valid';
          }
          return c;
        })));
      });
    });
    words.filter((w) => !w.valid).forEach((w) => {
      w.coords?.length && w.coords?.forEach(([i, j]) => {
        setValidArray((old) => old.map((r, k) => r.map((c, l) => {
          if (k === i && l === j) {
            return 'invalid';
          }
          return c;
        })));
      });
    });
    return words.filter((w) => w.valid).reduce((acc, w) => acc + w.score, 0);
  }, [words]);
  
  const start = useCallback(() => {
    const drawn = allTiles.slice(0, tilesToDraw);
    setAvailableTiles(drawn);
    setAllTiles((old) => old.slice(tilesToDraw));
    setTrayArray(drawn);
  }, [allTiles, tilesToDraw]);

  useEffect(() => {
    // find all words on the board
    const newFoundWords = [];
    setValidArray((old) => old.map((row, r) => row.map((col, c) => {
      console.log(r, c)
      if (!gridArray[r][c]) {
        return '';
      }
      return c;
    })));
    // check rows
    gridArray.forEach((row, index) => {
      // find all tiles which have no neightbor to the left
      const startTiles = row.filter((t, i) => t != null && (i === 0 || !row[i - 1]));
      startTiles.forEach((t) => {
        let i = row.indexOf(t);
        let word = '';
        let scr = 0;
        const wordCoords = [];
        while (i < row.length && row[i]) {
          word += row[i].props.letter.letter;
          scr += row[i].props.letter.value;
          wordCoords.push([index, i]);
          i++;
        }
        if (word.length > 1) {
          const valid = checkValidWord(word);
          newFoundWords.push({ word, valid, score: scr, coords: wordCoords });
        } else {
          // check if this letter has no vertical neightbors
          if ((index === 0 || !gridArray[index - 1][i]) && (index === gridArray.length - 1 || !gridArray[index + 1][i])) {
            newFoundWords.push({ word, valid: false, score: 0, coords: wordCoords });
          }
        }
      });
    });
    // check columns
    for (let i = 0; i < gridArray.length; i++) {
      const col = gridArray.map((row) => row[i]);
      const startTiles = col.filter((t, i) => t != null && (i === 0 || !col[i - 1]));
      startTiles.forEach((t) => {
        let j = col.indexOf(t);
        let word = '';
        const wordCoords = [];
        let scr = 0;
        while (j < col.length && col[j]) {
          word += col[j].props.letter.letter;
          scr += col[j].props.letter.value;
          wordCoords.push([j, i]);
          j++;
        }
        if (word.length > 1) {
          const valid = checkValidWord(word);
          newFoundWords.push({ word, valid, score: scr, coords: wordCoords });
        } else {
          // check if this letter has no horizontal neightbors
          if ((i === 0 || !gridArray[j][i - 1]) && (i === gridArray.length - 1 || !gridArray[j][i + 1])) {
            newFoundWords.push({ word, valid: false, score: 0, coords: wordCoords });
          }
        }
      });
      setWords(newFoundWords);
    }
  }, [gridArray, gridSize]);

  const handleDragStart = useCallback((event) => {
    const newActiveTile = availableTiles.find((t) => t.props.id === event.active.id);
    setActiveTile(newActiveTile);
    setTrayArray((old) => [...old.filter((t) => t.props.id !== event.active.id)]);
    setGridArray((old) => old.map((r) => r.map((c) => {
      if (c === newActiveTile) {
        return null;
      }
      return c;
    })));

  }, [availableTiles]);

  const handleDragEnd = useCallback((event) => {
    if (event.over?.id && event.over.id !== 'tray') {
      const row = parseInt(event.over.id.split(',')[0]);
      const col = parseInt(event.over.id.split(',')[1]);
      setGridArray((old) => old.map((r, i) => r.map((c, j) => {
        if (i === row && j === col) {
          return activeTile;
        }
        return c;
      })));
    } else {
      setTrayArray((old) => [...old, activeTile]);
    }
  }, [activeTile]);

  if (!gameStarted) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ fontSize: '24px', mt: 4 }}>
          Welcome to the game!
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
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Score score={score} target={target} />
        <Box sx={{ position: 'relative', top: 120 }}>
          <Grid gridArray={gridArray} validArray={validArray} />
        </Box>
        <Tray tiles={trayArray} />
        <DragOverlay>
          { activeTile }
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

export default App;
