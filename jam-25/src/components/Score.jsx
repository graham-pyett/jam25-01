import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import useIncrement from "./Counter";

const Score = ({ score, target, round, turnScore }) => {
  const matches = useMediaQuery('(max-width:767px)');
  const scoreDisplay = useIncrement(score);
  const turnScoreDisplay = useIncrement(turnScore);
  return (
    <Box sx={{ width: matches ? '40vw' : 500, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', py: 1, px: 2, borderRadius: '8px', border: '1px solid slategrey', backgroundColor: 'whitesmoke', minHeight: 70 }}>
      <Box sx={{ maxWidth: '50%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant='overline'>Round {round}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant='h4' sx={{ minWidth: String(score).length * 6, mr: 1, fontSize: matches ? `${Math.max(Math.min(30 / (scoreDisplay?.toString().length ?? 1) * 2 + 5, 25), 14)}px` : undefined, color: scoreDisplay >= target ? '#11adab' : (scoreDisplay < 0 ? 'rgb(158, 8, 28)' : '#5a6363') }}>{scoreDisplay}</Typography>
          {
            turnScoreDisplay != null && (
              <Typography variant='h5' sx={{ fontSize: matches ? `${Math.max(Math.min(30 / (turnScoreDisplay?.toString().length ?? 1) * 2, 16), 12)}px` : undefined, color: turnScoreDisplay + scoreDisplay >= target ? '#11adab' : (turnScoreDisplay < 0 ? 'rgb(158, 8, 28)' : '#5a6363') }}>{turnScoreDisplay >= 0 ? '+' : ''} {turnScoreDisplay}</Typography>
            )
          }
        </Box>
      </Box>
      <Box className="target" sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Typography variant='overline'>Target</Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', height: '100%' }}>
          <Typography variant='h6' sx={{ fontSize: matches ? `${Math.max(Math.min(30 / (target?.toString().length ?? 1) * 2 + 3, 20), 12)}px` : undefined, color: '#11adab' }}>{target}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Score;
