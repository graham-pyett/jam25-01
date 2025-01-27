import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";

const Score = ({ score, target, round, turnScore }) => {
  const matches = useMediaQuery('(max-width:900px)');
  return (
    <Box sx={{ width: matches ? '60vw' : 500, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', py: 1, px: 2, borderRadius: '8px', border: '1px solid slategrey', backgroundColor: 'whitesmoke', minHeight: 70 }}>
      <Box>
        <Typography variant='overline'>Round {round}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h4' sx={{ color: score >= target ? '#11adab' : '#5a6363' }}>{score}</Typography>
          {
            turnScore != null && (
              <Typography variant='h5' sx={{ ml: 1, color: turnScore + score >= target ? '#11adab' : '#5a6363' }}>{turnScore >= 0 ? '+' : ''} {turnScore}</Typography>
            )
          }
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant='overline'>Target</Typography>
        <Typography variant='h6'>{target}</Typography>
      </Box>
    </Box>
  );
};

export default Score;
