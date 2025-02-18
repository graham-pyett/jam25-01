import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getStarterLetters } from "../letters";
import InventoryItem from "../components/InventoryItem";
import Glyph from "../components/Glyph";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebaseSetup/firebase";
import { useUser } from "./UserProvider";
import { GLYPHS, LAYOUTS } from "../upgrades";

const GameDataContext = createContext(null);

export const PHASES = {
  'PREGAME': 'PREGAME',
  'PLAYING': 'PLAYING',
  'SUMMARY': 'SUMMARY',
  'SHOPPING': 'SHOPPING',
  'PLACEMENT': 'PLACEMENT',
  'GAMEOVER': 'GAMEOVER',
}

export const calcTarget = (round, layout) => {
  return (Math.round(
    (
      Math.pow((round * 10), 1.85)
      + 350
    )
    / 100
  ) * 10) - 40 + (LAYOUTS[layout].round1Target ?? 0);
}

const GameDataProvider = ({ children }) => {
  const { user } = useUser();
  const [layout, setLayout] = useState('BASE');
  const [blanks, setBlanks] = useState({});
  const [fixedTiles, setFixedTiles] = useState([]);
  const [scoringTiles, setScoringTiles] = useState([]);
  const [bagTiles, setBagTiles] = useState([]);
  const [swapTiles, setSwapTiles] = useState([]);
  const [dealing, setDealing] = useState(false);
  const [retrieving, setRetrieving] = useState([]);
  const transitionRefs = useRef({});
  const turnOffDealing = useRef(null);
  const [roundOver, setRoundOver] = useState(false);
  const [turnOver, setTurnOver] = useState(true);
  const [activeGlyph, setActiveGlyph] = useState(null);
  const [gridSizeY, setGridSizeY] = useState(LAYOUTS[layout].gridSizeY);
  const [gridSizeX, setGridSizeX] = useState(LAYOUTS[layout].gridSizeX);
  const [tileLibrary, setTileLibrary] = useState(getStarterLetters());
  const [funds, setFunds] = useState(3);
  const [target, setTarget] = useState(calcTarget(0, layout));
  const [bonusSpaces, setBonusSpaces] = useState(LAYOUTS[layout].bonusSpaces);
  const [round, setRound] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [glyphs, setGlyphs] = useState([]); 
  const [maxGlyphs, setMaxGlyphs] = useState(LAYOUTS[layout].maxGlyphs);
  const [gameStarted, setGameStarted] = useState(false);
  const [tilesToDraw, setTilesToDraw] = useState(LAYOUTS[layout].tilesToDraw);
  const [blacks, setBlacks] = useState(LAYOUTS[layout].blacks);
  const [phase, setPhase] = useState(PHASES.PREGAME)

  useEffect(() => {
    if (phase === PHASES.PREGAME) {
      setGridSizeX(LAYOUTS[layout].gridSizeX);
      setGridSizeY(LAYOUTS[layout].gridSizeY);
      setMaxGlyphs(LAYOUTS[layout].maxGlyphs);
      setBonusSpaces(LAYOUTS[layout].bonuses);
      setTilesToDraw(LAYOUTS[layout].tilesToDraw);
      setBlacks(LAYOUTS[layout].blacks);
    }
  }, [layout, phase]);

  useEffect(() => {
    if (dealing) {
      bagTiles.forEach((tile, i) => {
        if (!transitionRefs.current[tile]) {
          transitionRefs.current[tile] = setTimeout(() => {
            setBagTiles((old) => old.filter((t) => t !== tile));
            clearTimeout(turnOffDealing.current);
            turnOffDealing.current = setTimeout(() => {
              setDealing(false);
              setTurnOver(false);
              transitionRefs.current = {};
            }, 200);
          }, 400 + (i * 100));
        }
      });
    }
  }, [bagTiles, dealing, retrieving]);

  useEffect(() => {
    if (retrieving.length) {
      retrieving.forEach((tile, i) => {
        if (!transitionRefs.current[tile]) {
          transitionRefs.current[tile] = setTimeout(() => {
            setBagTiles((old) => [...old, tile]);
            clearTimeout(turnOffDealing.current);
            turnOffDealing.current = setTimeout(() => {
              setTurnOver(false);
              transitionRefs.current = {};
            }, 200);
          }, 400 + (i * 100));
        }
      });
    }
  }, [retrieving]);

  useEffect(() => {
    if (swapTiles.length) {
      swapTiles.forEach((tile, i) => {
        if (!transitionRefs.current[tile]) {
          transitionRefs.current[tile] = setTimeout(() => {
            setSwapTiles((old) => [...old, tile]);
            clearTimeout(turnOffDealing.current);
            turnOffDealing.current = setTimeout(() => {
              transitionRefs.current = {};
            }, 200);
          }, 100 + (i * 100));
        }
      });
    }
  }, [swapTiles]);

  useEffect(() => {
    if (gameStarted) {
      const newGame = JSON.stringify({
        gridSizeY,
        gridSizeX,
        tileLibrary,
        funds,
        target,
        bonusSpaces,
        round,
        inventory: inventory?.map((i) => i.props?.item) ?? [],
        glyphs: glyphs?.map((j) => j.props?.glyph?.name) ?? [],
        maxGlyphs,
        layout,
        phase,
        blacks,
      });
      localStorage.setItem('gameData', newGame);
      if (user?.uid) {
        setDoc(doc(firestore, 'users', user.uid), { ...user, savedGame: newGame });
      }
    }
  }, [gridSizeY, gridSizeX, tileLibrary, funds, target, bonusSpaces, round, inventory, glyphs, maxGlyphs, gameStarted, user, layout, phase, blacks]);

  const savedGame = useCallback(() => {
    const data = JSON.parse(localStorage.getItem('gameData')) ?? null;
    let userGame;
    if (user?.uid) {
      userGame = user?.savedGame ? JSON.parse(user?.savedGame) : null;
    }
    let game = userGame ?? data;
    if (userGame && data) {
      if (userGame.round > data.round) {
        game = userGame;
      } else {
        game = data;
      }
    }
    if (game) {
      game.inventory = game?.inventory?.map((i) => <InventoryItem key={i.id} item={i} />) ?? [];
      game.glyphs = game?.glyphs?.map((j) => <Glyph glyph={GLYPHS.find((g) => g.name === j)} id={GLYPHS.find((g) => g.name === j)?.id} />) ?? [];
    }
    return game;
  }, [user]);

  const clearGame = useCallback(() => {
    localStorage.removeItem('gameData');
    if (user?.uid) {
      setDoc(doc(firestore, 'users', user.uid), { ...user, savedGame: null });
    }
  }, [user]);

  const loadGame = useCallback(() => {
    const data = savedGame();
    if (data) {
      setGridSizeY(data.gridSizeY ?? 7);
      setGridSizeX(data.gridSizeX ?? 7);
      setTileLibrary(data.tileLibrary ?? getStarterLetters());
      setFunds(data.funds ?? 3);
      setTarget(data.target ?? calcTarget(0));
      setBonusSpaces(data.bonusSpaces ?? [{ id: `${Math.floor((gridSizeY ?? 7) / 2)},${Math.floor((gridSizeX ?? 7) / 2)}`, bonus: 'BDW' }]);
      setRound(data.round ?? 0);
      setInventory(data.inventory ?? []);
      setGlyphs(data.glyphs ?? []);
      setMaxGlyphs(data.maxGlyphs ?? 5);
      setLayout(data.layout ?? 'BASE');
      setPhase(data.phase ?? PHASES.PREGAME);
      setBlacks(data.blacks ?? [])
      setTimeout(() => {
        setGameStarted(true);
      }, 500);
    }
  }, [gridSizeX, gridSizeY, savedGame]);

  const value = useMemo(() => {
    return {
      blanks, setBlanks,
      fixedTiles, setFixedTiles,
      scoringTiles, setScoringTiles,
      bagTiles, setBagTiles,
      dealing, setDealing,
      roundOver, setRoundOver,
      turnOver, setTurnOver,
      retrieving, setRetrieving,
      swapTiles, setSwapTiles,
      activeGlyph, setActiveGlyph,
      gridSizeY, setGridSizeY,
      gridSizeX, setGridSizeX,
      tileLibrary, setTileLibrary,
      funds, setFunds,
      target, setTarget,
      bonusSpaces, setBonusSpaces,
      round, setRound,
      inventory, setInventory,
      glyphs, setGlyphs,
      maxGlyphs, setMaxGlyphs,
      gameStarted, setGameStarted,
      tilesToDraw, setTilesToDraw,
      phase, setPhase,
      blacks, setBlacks,
      layout, setLayout,
      loadGame,
      savedGame,
      clearGame,
    };
  }, [tilesToDraw, phase, layout, blacks, blanks, fixedTiles, scoringTiles, bagTiles, dealing, roundOver, turnOver, retrieving, swapTiles, activeGlyph, gridSizeY, gridSizeX, tileLibrary, funds, target, bonusSpaces, round, inventory, glyphs, maxGlyphs, gameStarted, loadGame, savedGame, clearGame]);

  return <GameDataContext.Provider value={value}>{children}</GameDataContext.Provider>;
};

const useGameData = () => {
  const context = useContext(GameDataContext);

  if (!context) {
    throw new Error('useGameData must be used within a GameDataProvider');
  }

  return context;
};

export { GameDataProvider, GameDataContext, useGameData };