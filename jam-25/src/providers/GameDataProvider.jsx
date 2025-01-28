import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const GameDataContext = createContext(null);

const GameDataProvider = ({ children }) => {
  const [blanks, setBlanks] = useState({});
  const [fixedTiles, setFixedTiles] = useState([]);
  const [scoringTiles, setScoringTiles] = useState([]);
  const [bagTiles, setBagTiles] = useState([]);
  const [dealing, setDealing] = useState(false);
  const transitionRefs = useRef({});
  const turnOffDealing = useRef(null);
  const [roundOver, setRoundOver] = useState(false);
  const [turnOver, setTurnOver] = useState(true);

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
  }, [bagTiles, dealing]);

  const value = useMemo(() => {
    return {
      blanks, setBlanks,
      fixedTiles, setFixedTiles,
      scoringTiles, setScoringTiles,
      bagTiles, setBagTiles,
      dealing, setDealing,
      roundOver, setRoundOver,
      turnOver, setTurnOver,
    };
  }, [blanks, fixedTiles, scoringTiles, bagTiles, dealing, roundOver, turnOver]);

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