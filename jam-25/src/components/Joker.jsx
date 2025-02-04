import { Box, Tooltip, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useGameData } from "../providers/GameDataProvider";

const Joker = ({ sx, joker, id }) => {
  const { scoringTiles } = useGameData();
  const scoringTile = useMemo(() => scoringTiles?.find((t) => t.id === id) ?? {}, [id, scoringTiles]);
  return (
    <Box
      key={id}
      sx={{ boxSizing: 'border-box', m: '3px', width: '44px', height: '44px', borderRadius: '4px', fontSize: '24px',  display: 'flex', justifyContent: 'center', alignItems: 'center',  position: 'relative', zIndex: 3, ...joker.style }}
    >
      <Tooltip arrow placement="bottom" title={(
        <Box sx={{ fontSize: 12, color: 'white',  borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>{joker.name}</Typography>
          <Typography variant='body2' sx={{ textAlign: 'center' }}>{joker.description}</Typography>
        </Box>
        )}>
        {joker.text}
      </Tooltip>
      <Tooltip arrow open={!!(scoringTile.score || scoringTile.newMoney || scoringTile.text)} title={(
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {scoringTile.score !== 0 && (<span style={{ fontFamily: 'Orbitron', fontSize: 16, color: scoringTile.score < 0 ? '#ff9ca7' : '#b3faaa'}}>
            {scoringTile.score >= 0 ? '+' : ''} {scoringTile.score ?? ''}
          </span>)}
          {scoringTile.newMoney !== 0 && (<span style={{ fontFamily: 'Orbitron', fontSize: 16, color: '#fffb80'}}>
            {scoringTile.newMoney >= 0 ? '+' : ''} {scoringTile.newMoney ?? ''}
          </span>)}
          {scoringTile.text && (<span style={{ fontFamily: 'Orbitron', fontSize: 16, color: '#b3faaa'}}>
            {scoringTile.text}
          </span>)}
        </Box>
        )} placement="bottom">
        <Box sx={{ width: '100%', height: '100%', pointerEvents: 'none', position: 'absolute' }} />
      </Tooltip>
    </Box>
  );
};

export default Joker;
