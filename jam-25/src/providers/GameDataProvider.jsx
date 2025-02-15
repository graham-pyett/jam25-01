import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getStarterLetters } from "../letters";
import InventoryItem from "../components/InventoryItem";
import Joker from "../components/Joker";
import { JOKERS } from "../upgrades";

const GameDataContext = createContext(null);

export const calcTarget = (round) => {
  return Math.round(
    (
      Math.pow((round * 10), 1.85)
      + 350
    )
    / 100
  ) * 10;
}

const GameDataProvider = ({ children }) => {
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
  const [shopOpen, setShopOpen] = useState(false);
  const [activeJoker, setActiveJoker] = useState(null);
  const [gridSizeY, setGridSizeY] = useState(7);
  const [gridSizeX, setGridSizeX] = useState(7);
  const [tileLibrary, setTileLibrary] = useState(getStarterLetters());
  const [funds, setFunds] = useState(3);
  const [target, setTarget] = useState(calcTarget(0));
  const [bonusSpaces, setBonusSpaces] = useState([{ id: `${Math.floor(gridSizeY / 2)},${Math.floor(gridSizeX / 2)}`, bonus: 'BDW' }]);
  const [round, setRound] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [jokers, setJokers] = useState([]); 
  const [maxJokers, setMaxJokers] = useState(5);
  const [gameStarted, setGameStarted] = useState(false);

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
      localStorage.setItem('gameData', JSON.stringify({
        gridSizeY,
        gridSizeX,
        tileLibrary,
        funds,
        target,
        bonusSpaces,
        round,
        inventory: inventory.map((i) => i.props.item),
        jokers: jokers.map((j) => j.props.joker),
        maxJokers,
      }));
    }
  }, [gridSizeY, gridSizeX, tileLibrary, funds, target, bonusSpaces, round, inventory, jokers, maxJokers, gameStarted]);

  const savedGame = useCallback(() => {
    const data = JSON.parse(localStorage.getItem('gameData')) ?? null;
    if (data) {
      data.inventory = data?.inventory?.map((i) => <InventoryItem key={i.id} item={i} />) ?? [];
      data.jokers = data?.jokers?.map((j) => <Joker joker={j} id={j.id} />) ?? [];
    }
    return data;
  }, []);

  const clearGame = useCallback(() => {
    localStorage.removeItem('gameData');
  }, []);

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
      setJokers(data.jokers ?? []);
      setMaxJokers(data.maxJokers ?? 5);
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
      loadGame,
      savedGame,
      clearGame,
    };
  }, [blanks, fixedTiles, scoringTiles, bagTiles, dealing, roundOver, turnOver, retrieving, swapTiles, shopOpen, activeJoker, gridSizeY, gridSizeX, tileLibrary, funds, target, bonusSpaces, round, inventory, jokers, maxJokers, gameStarted, loadGame, savedGame, clearGame]);

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