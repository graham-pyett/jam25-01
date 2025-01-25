import { Box, Typography } from "@mui/material";
import React from "react";

const Score = ({ score, target }) => {
  return (
    <Box sx={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: 500, mt: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', p: 2, borderRadius: '8px', border: '1px solid slategrey', backgroundColor: 'whitesmoke', minHeight: 70, boxSizing: 'border-box' }}>
      <Box>
        <Typography variant='h4'>{score}</Typography>
      </Box>
      <Box>
        <Typography variant='h6'>{target}</Typography>
      </Box>
    </Box>
  );
};

export default Score;
