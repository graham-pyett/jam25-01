import { Box, Tooltip, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useGameData } from "../providers/GameDataProvider";

const Tile = ({ sx, letter, id }) => {
  const { blanks, fixedTiles, scoringTiles } = useGameData();
  const { attributes, listeners, setNodeRef } = useDraggable({ id, disabled: fixedTiles?.includes(id) || scoringTiles.length, data: { type: 'tile' } });
  const displayedLetter = useMemo(() => blanks?.[id] ?? letter.letter, [blanks, id, letter.letter]);

  const style = useMemo(() => {
    let newStyle = { border: '1px solid tan', backgroundColor: 'antiquewhite' };
    if (letter.isBlank) {
      newStyle = { border: '2px solid darkmagenta', color: 'darkmagenta', ...newStyle, };
    }
    if (displayedLetter.length === 2) {
      newStyle = { fontSize: '20px', ...newStyle };
    }
    if (displayedLetter.length === 3) {
      newStyle = { fontSize: '18px', ...newStyle };
    }
    if (displayedLetter.length === 4) {
      newStyle = { fontSize: '16px', ...newStyle };
    }

     return newStyle;
  }, [displayedLetter.length, letter.isBlank]);

  return (
    <Box
      className={fixedTiles?.includes(id) || scoringTiles.length ? '' : "tile"}
      ref={setNodeRef}
      sx={{ touchAction: 'none', boxSizing: 'border-box', m: '3px', width: '44px', height: '44px', borderRadius: '4px', fontSize: '24px', ...style, backgroundColor: fixedTiles?.includes(id) ? 'gainsboro' : style.backgroundColor, display: 'flex', justifyContent: 'center', alignItems: 'center',  position: 'relative', zIndex: 3, pt: letter.multiplier ? 0.5 : 0,  ...sx }}
      {...listeners}
      {...attributes}
    >
      {
        (letter.multiplier) && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, fontSize: '10px', color: 'black', backgroundColor: '#4dd3eb', px: '3px', borderRadius: '4px 2px 2px 2px' }}>
            {`x${letter.multiplier}`}
          </Box>
        )
      }
      <Tooltip arrow placement="top" title={letter.multiplier && (
        <Box sx={{ fontSize: 12, color: 'white',  borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant='h6'>{letter.letter}</Typography>
          <Typography variant='body2'>`x${letter.multiplier} ${letter.value}` points</Typography>
        </Box>
      )}>
        {displayedLetter}
      </Tooltip>
      <Box sx={{ position: 'absolute', bottom: displayedLetter.length > 2 ? -1 : 1, right: 4, fontSize: '10px', fontFamily: 'Orbitron' }}>
        {letter.value}
      </Box>
      <Tooltip arrow open={!!scoringTiles?.find((t) => t.id === id && t.placement === 'top')} title={<span style={{ fontFamily: 'Orbitron', fontSize: 16, color: scoringTiles?.find((t) => t.id === id && t.placement === 'top')?.score < 0 ? '#ff9ca7' : '#b3faaa'}}>{scoringTiles?.find((t) => t.id === id && t.placement === 'top')?.score >= 0 ? '+' : ''} {scoringTiles?.find((t) => t.id === id && t.placement === 'top')?.score ?? ''}</span>} placement="top">
        <Box sx={{ width: '100%', height: '100%', pointerEvents: 'none', position: 'absolute' }} />
      </Tooltip>
      <Tooltip arrow open={!!scoringTiles?.find((t) => t.id === id && t.placement === 'left')} title={<span style={{ fontFamily: 'Orbitron', fontSize: 16, color: scoringTiles?.find((t) => t.id === id && t.placement === 'left')?.score < 0 ? '#ff9ca7' : '#b3faaa'}}>{scoringTiles?.find((t) => t.id === id && t.placement === 'left')?.score >= 0 ? '+' : ''} {scoringTiles?.find((t) => t.id === id && t.placement === 'left')?.score ?? ''}</span>} placement="left">
        <Box sx={{ width: '100%', height: '100%', pointerEvents: 'none', position: 'absolute' }} />
      </Tooltip>
    </Box>
  );
};

export default Tile;
