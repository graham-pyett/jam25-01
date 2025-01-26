import React, { createContext, useContext, useMemo, useState } from "react";

const GameDataContext = createContext(null);

const GameDataProvider = ({ children }) => {
  const [blanks, setBlanks] = useState({});
  const [fixedTiles, setFixedTiles] = useState([]);

  const value = useMemo(() => {
    return {
      blanks, setBlanks,
      fixedTiles, setFixedTiles
    };
  }, [blanks, fixedTiles]);

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