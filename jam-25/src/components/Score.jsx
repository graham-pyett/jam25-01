import { Box, Typography } from "@mui/material";
import React from "react";

const Score = ({ score, target, round }) => {
  return (
    <Box sx={{ width: 500, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', py: 1, px: 2, borderRadius: '8px', border: '1px solid slategrey', backgroundColor: 'whitesmoke', minHeight: 70 }}>
      <Box>
        <Typography variant='overline'>Round {round}</Typography>
        <Typography variant='h4'>{score}</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant='overline'>Target</Typography>
        <Typography variant='h6'>{target}</Typography>
      </Box>
    </Box>
  );
};

export default Score;
