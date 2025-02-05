import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";

const Score = ({ score, target, round, turnScore }) => {
  const matches = useMediaQuery('(max-width:900px)');
  return (
    <Box sx={{ width: matches ? '40vw' : 500, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', py: 1, px: 2, borderRadius: '8px', border: '1px solid slategrey', backgroundColor: 'whitesmoke', minHeight: 70 }}>
      <Box sx={{ maxWidth: '50%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>Round {round}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant='h4' sx={{ mr: 1, fontSize: matches ? `${Math.max(Math.min(30 / (score?.toString().length ?? 1) * 2 + 5, 25), 14)}px` : undefined, color: score >= target ? '#11adab' : (score < 0 ? 'rgb(158, 8, 28)' : '#5a6363'), fontFamily: 'Orbitron' }}>{score}</Typography>
          {
            turnScore != null && (
              <Typography variant='h5' sx={{ fontSize: matches ? `${Math.max(Math.min(30 / (turnScore?.toString().length ?? 1) * 2, 16), 12)}px` : undefined, color: turnScore + score >= target ? '#11adab' : (turnScore < 0 ? 'rgb(158, 8, 28)' : '#5a6363'), fontFamily: 'Orbitron' }}>{turnScore >= 0 ? '+' : ''} {turnScore}</Typography>
            )
          }
        </Box>
      </Box>
      <Box className="target" sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>Target</Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', height: '100%' }}>
          <Typography variant='h6' sx={{ fontSize: matches ? `${Math.max(Math.min(30 / (target?.toString().length ?? 1) * 2 + 3, 20), 12)}px` : undefined, fontFamily: 'Orbitron', color: '#11adab' }}>{target}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Score;
