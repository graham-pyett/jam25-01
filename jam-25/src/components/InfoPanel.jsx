import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";

const InfoPanel = ({ bag, swaps, turn, turns, money}) => {
  const matches = useMediaQuery('(max-width:900px)');
  return (
    <Box sx={{ backgroundColor: '#564c59', color: 'white', p: matches ? 1 : 2, borderRadius: '8px', border: '1px solid ghostwhite', width: matches ? 'calc(25vw - 4px)' : 120, mr: matches ? 1 : 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between'}}><span><Typography variant='overline'>Bag:</Typography></span><span><Typography variant='overline'>{bag}</Typography></span></Box>
      <Box sx={{ display: 'flex', width: '100%',  justifyContent: 'space-between'}}><span><Typography variant='overline'>Swaps:</Typography></span><span><Typography variant='overline'>{swaps}</Typography></span></Box>
      <Box sx={{ display: 'flex', width: '100%',  justifyContent: 'space-between'}}><span><Typography variant='overline'>Turn:</Typography></span><span><Typography variant='overline'>{turn}/{turns}</Typography></span></Box>
      <Box sx={{ display: 'flex', width: '100%',  justifyContent: 'flex-end'}}><span><Typography variant='overline' sx={{ fontSize: 16, color: 'gold', lineHeight: 1 }}>${money}</Typography></span></Box>
    </Box>
  )
};

export default InfoPanel;
