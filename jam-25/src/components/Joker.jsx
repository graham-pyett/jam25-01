import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useGameData } from "../providers/GameDataProvider";

const Joker = ({ sx, joker, id }) => {
  const { scoringTiles } = useGameData();
  return (
    <Box
      key={id}
      sx={{ boxSizing: 'border-box', m: '3px', width: '44px', height: '44px', borderRadius: '4px', fontSize: '24px',  display: 'flex', justifyContent: 'center', alignItems: 'center',  position: 'relative', zIndex: 3, ...joker.style }}
    >
      <Tooltip arrow placement="bottom" title={(
        <Box sx={{ fontSize: 12, color: 'white',  borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>{joker.name}</Typography>
          <Typography variant='body2'>{joker.description}</Typography>
        </Box>
        )}>
        {joker.text}
      </Tooltip>
      <Tooltip arrow open={!!scoringTiles?.find((t) => t.id === id)} title={(
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {scoringTiles?.find((t) => t.id === id)?.score !== 0 && (<span style={{ fontFamily: 'Orbitron', fontSize: 16, color: scoringTiles?.find((t) => t.id === id)?.score < 0 ? '#ff9ca7' : '#b3faaa'}}>
            {scoringTiles?.find((t) => t.id === id)?.score >= 0 ? '+' : ''} {scoringTiles?.find((t) => t.id === id)?.score ?? ''}
          </span>)}
          {scoringTiles?.find((t) => t.id === id)?.newMoney !== 0 && (<span style={{ fontFamily: 'Orbitron', fontSize: 16, color: '#fffb80'}}>
            {scoringTiles?.find((t) => t.id === id)?.newMoney >= 0 ? '+' : ''} {scoringTiles?.find((t) => t.id === id)?.newMoney ?? ''}
          </span>)}
        </Box>
        )} placement="bottom">
        <Box sx={{ width: '100%', height: '100%', pointerEvents: 'none', position: 'absolute' }} />
      </Tooltip>
    </Box>
  );
};

export default Joker;
