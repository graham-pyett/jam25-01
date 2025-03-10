import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { useGameData } from "../providers/GameDataProvider";
import useIncrement from "./Counter";

const InfoPanel = ({ swaps, turn, turns, money}) => {
  const matches = useMediaQuery('(max-width:767px)');
  const { totalScore } = useGameData();
  const totalScoreDisplay = useIncrement(totalScore);
  return (
    <Box sx={{ backgroundColor: '#564c59', color: 'white', p: matches ? 1 : 2, borderRadius: '8px', border: '1px solid ghostwhite', width: matches ? 'calc(25vw - 4px)' : 120, mr: matches ? 1 : 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', width: '100%',  justifyContent: 'space-between'}}><span><Typography variant='overline'>Score:</Typography></span><span><Typography variant='overline' sx={{ color: '#11adab' }}>{totalScoreDisplay}</Typography></span></Box>
      <Box sx={{ display: 'flex', width: '100%',  justifyContent: 'space-between'}}><span><Typography variant='overline'>Swaps:</Typography></span><span><Typography variant='overline'>{swaps}</Typography></span></Box>
      <Box sx={{ display: 'flex', width: '100%',  justifyContent: 'space-between'}}><span><Typography variant='overline'>Turn:</Typography></span><span><Typography variant='overline'>{turn}/{turns}</Typography></span></Box>
      <Box sx={{ display: 'flex', width: '100%',  justifyContent: 'flex-end'}}><span><Typography variant='overline' sx={{ fontSize: 16, color: money >= 0 ? 'gold' : 'rgb(158, 8, 28)', lineHeight: 1 }}>${money}</Typography></span></Box>
    </Box>
  )
};

export default InfoPanel;
