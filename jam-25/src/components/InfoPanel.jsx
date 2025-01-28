import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";

const InfoPanel = ({ swaps, turn, turns, money}) => {
  const matches = useMediaQuery('(max-width:900px)');
  return (
    <Box sx={{ backgroundColor: '#564c59', color: 'white', p: matches ? 1 : 2, borderRadius: '8px', border: '1px solid ghostwhite', width: matches ? 'calc(25vw - 4px)' : 120, mr: matches ? 1 : 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', width: '100%',  justifyContent: 'space-between'}}><span><Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>Swaps:</Typography></span><span><Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>{swaps}</Typography></span></Box>
      <Box sx={{ display: 'flex', width: '100%',  justifyContent: 'space-between'}}><span><Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>Turn:</Typography></span><span><Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>{turn}/{turns}</Typography></span></Box>
      <Box sx={{ display: 'flex', width: '100%',  justifyContent: 'flex-end'}}><span><Typography variant='overline' sx={{ fontFamily: 'Orbitron', fontSize: 16, color: 'gold', lineHeight: 1 }}>${money}</Typography></span></Box>
    </Box>
  )
};

export default InfoPanel;
