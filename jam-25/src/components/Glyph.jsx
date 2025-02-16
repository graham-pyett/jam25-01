import { Box, ClickAwayListener, Tooltip, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useGameData } from "../providers/GameDataProvider";
import { useDraggable, useDroppable } from "@dnd-kit/core";

const Glyph = ({ sx, glyph, id }) => {
  const { scoringTiles, shopOpen, activeGlyph } = useGameData();
  const scoringTile = useMemo(() => scoringTiles?.find((t) => t.id === id) ?? {}, [id, scoringTiles]);
  const { setNodeRef, attributes, listeners } = useDraggable({
    id,
    disabled: !shopOpen,
    data: { type: 'glyph' }
  });
  const { attributes: dropLeftAttr, listeners: dropLeftList, setNodeRef: setNodeRefDropLeft } = useDroppable({ id: `${id}-left`, data: { accepts: 'glyph' } });
  const { attributes: dropRightAttr, listeners: dropRightList, setNodeRef: setNodeRefDropRight } = useDroppable({ id: `${id}-right`, data: { accepts: 'glyph' } });
  const [ttipOpen, setTtipOpen] = useState(false);

  return (
    <Box
      className={[shopOpen ? 'glyph-hover' : '', 'draggable'].join(' ')}
      id={id}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      key={id}
      sx={{ boxSizing: 'border-box', m: '3px', width: '44px', height: '44px', borderRadius: '4px', fontSize: '24px',  display: 'flex', justifyContent: 'center', alignItems: 'center',  position: 'relative', zIndex: 3, ...glyph.style }}
    >
      <ClickAwayListener onClickAway={() => setTtipOpen(false)}>
        <Box sx={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setTtipOpen(!ttipOpen)}>
        <Box sx={{ position: 'absolute', top: 0, right: 0, fontSize: '10px', color: 'white', backgroundColor: ['', '#7abf1f', '#34249c', '#b0102b'][glyph.rarity], px: '3px', borderRadius: '2px 4px 2px 2px' }}>
          {['C', 'U', 'R', 'S'][glyph.rarity]}
        </Box>
        <Tooltip open={ttipOpen} onClose={() => setTtipOpen(false)} disableFocusListener disableHoverListener disableTouchListener arrow placement="bottom" title={activeGlyph?.props?.id !== id ? (
          <Box sx={{ fontSize: 12, color: 'white',  borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
            <Typography variant='overline'>{glyph.name}</Typography>
            <Typography variant='body2' sx={{ textAlign: 'center' }}>{glyph.description}</Typography>
            <Typography variant='overline' sx={{ fontSize: 8 }}>{['Common', 'Uncommon', 'Rare', 'Shiny'][glyph.rarity]}</Typography>
          </Box>
          ): null}>
          {glyph.text}
          <Box ref={setNodeRefDropLeft} {...dropLeftList} {...dropRightAttr} sx={{ height: '100%', width: '45%', position: 'absolute', left: 0 }} />
          <Box sx={{ height:'100%', width: '45%', position: 'absolute', right: 0 }} ref={setNodeRefDropRight} {...dropRightList} {...dropLeftAttr} />
        </Tooltip>
        <Tooltip arrow open={!!(scoringTile.score || scoringTile.newMoney || scoringTile.text || scoringTile.newMoney === 0)} title={(
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {(scoringTile.score !== 0 || scoringTile.newMoney === 0) && (<span style={{ fontSize: 16, color: scoringTile.score < 0 ? '#ff9ca7' : '#b3faaa'}}>
              {scoringTile.score >= 0 ? '+' : ''} {scoringTile.score ?? ''}
            </span>)}
            {scoringTile.newMoney !== 0 && (<span style={{ ffontSize: 16, color: '#fffb80'}}>
              {scoringTile.newMoney >= 0 ? '+' : ''} {scoringTile.newMoney ?? ''}
            </span>)}
            {scoringTile.text && (<span style={{ fontSize: 16, color: '#b3faaa'}}>
              {scoringTile.text}
            </span>)}
          </Box>
          )} placement="bottom">
          <Box sx={{ width: '100%', height: '100%', pointerEvents: 'none', position: 'absolute' }} />
        </Tooltip>
        </Box>
      </ClickAwayListener>
    </Box>
  );
};

export default Glyph;
