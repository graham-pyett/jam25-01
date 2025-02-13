import { Box, ClickAwayListener, Tooltip, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useGameData } from "../providers/GameDataProvider";
import { useDraggable, useDroppable } from "@dnd-kit/core";

const Joker = ({ sx, joker, id }) => {
  const { scoringTiles, shopOpen, activeJoker } = useGameData();
  const scoringTile = useMemo(() => scoringTiles?.find((t) => t.id === id) ?? {}, [id, scoringTiles]);
  const { setNodeRef, attributes, listeners } = useDraggable({
    id,
    disabled: !shopOpen,
    data: { type: 'joker' }
  });
  const { attributes: dropLeftAttr, listeners: dropLeftList, setNodeRef: setNodeRefDropLeft } = useDroppable({ id: `${id}-left`, data: { accepts: 'joker' } });
  const { attributes: dropRightAttr, listeners: dropRightList, setNodeRef: setNodeRefDropRight } = useDroppable({ id: `${id}-right`, data: { accepts: 'joker' } });
  const [ttipOpen, setTtipOpen] = useState(false);

  return (
    <Box
      className={[shopOpen ? 'joker-hover' : '', 'draggable'].join(' ')}
      id={id}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      key={id}
      sx={{ boxSizing: 'border-box', m: '3px', width: '44px', height: '44px', borderRadius: '4px', fontSize: '24px',  display: 'flex', justifyContent: 'center', alignItems: 'center',  position: 'relative', zIndex: 3, ...joker.style }}
    >
      <ClickAwayListener onClickAway={() => setTtipOpen(false)}>
        <Box sx={{ height: '100%', width: '100%' }} onClick={() => setTtipOpen(!ttipOpen)}>
        <Box sx={{ position: 'absolute', top: 0, right: 0, fontSize: '10px', color: 'white', backgroundColor: ['', '#7abf1f', '#34249c', '#b0102b'][joker.rarity], px: '3px', borderRadius: '2px 4px 2px 2px' }}>
          {['C', 'U', 'R', 'S'][joker.rarity]}
        </Box>
        <Tooltip open={ttipOpen} onClose={() => setTtipOpen(false)} disableFocusListener disableHoverListener disableTouchListener arrow placement="bottom" title={activeJoker?.props?.id !== id ? (
          <Box sx={{ fontSize: 12, color: 'white',  borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
            <Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>{joker.name}</Typography>
            <Typography variant='body2' sx={{ textAlign: 'center' }}>{joker.description}</Typography>
            <Typography variant='overline' sx={{ fontFamily: 'Orbitron', fontSize: 8 }}>{['Common', 'Uncommon', 'Rare', 'Shiny'][joker.rarity]}</Typography>
          </Box>
          ): null}>
          {joker.text}
          <Box ref={setNodeRefDropLeft} {...dropLeftList} {...dropRightAttr} sx={{ height: '100%', width: '45%', position: 'absolute', left: 0 }} />
          <Box sx={{ height:'100%', width: '45%', position: 'absolute', right: 0 }} ref={setNodeRefDropRight} {...dropRightList} {...dropLeftAttr} />
        </Tooltip>
        <Tooltip arrow open={!!(scoringTile.score || scoringTile.newMoney || scoringTile.text || scoringTile.newMoney === 0)} title={(
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {(scoringTile.score !== 0 || scoringTile.newMoney === 0) && (<span style={{ fontFamily: 'Orbitron', fontSize: 16, color: scoringTile.score < 0 ? '#ff9ca7' : '#b3faaa'}}>
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
      </ClickAwayListener>
    </Box>
  );
};

export default Joker;
