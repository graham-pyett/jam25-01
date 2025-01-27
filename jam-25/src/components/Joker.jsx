import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useGameData } from "../providers/GameDataProvider";

const Joker = ({ sx, joker, id }) => {
  const { scoringTiles } = useGameData();
  return (
    <Box
      sx={{ boxSizing: 'border-box', m: '3px', width: '44px', height: '44px', borderRadius: '4px', fontSize: '24px',  display: 'flex', justifyContent: 'center', alignItems: 'center',  position: 'relative', zIndex: 3, ...joker.style }}
    >
      <Tooltip arrow open={!!scoringTiles?.find((t) => t.id === id)} title={<span style={{ color: scoringTiles?.find((t) => t.id === id)?.score < 0 ? '#ff9ca7' : '#b3faaa'}}>{scoringTiles?.find((t) => t.id === id)?.score >= 0 ? '+' : ''} ${scoringTiles?.find((t) => t.id === id)?.score ?? ''}</span>} placement="top">
        <div />
      </Tooltip>
      <Tooltip arrow placement="bottom" title={(
        <Box sx={{ fontSize: 12, color: 'white',  borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>{joker.name}</Typography>
          <Typography variant='body2'>{joker.description}</Typography>
        </Box>
        )}>
        {joker.text}
      </Tooltip>
    </Box>
  );
};

export default Joker;
