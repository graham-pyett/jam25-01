import { Box, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useGameData } from "../providers/GameDataProvider";

const Tile = ({ sx, letter, id, dealable }) => {
  const { blanks, fixedTiles, scoringTiles, bagTiles, dealing, roundOver, turnOver } = useGameData();
  const { attributes, listeners, setNodeRef } = useDraggable({ id, disabled: fixedTiles?.includes(id) || scoringTiles.length, data: { type: 'tile' } });
  const displayedLetter = useMemo(() => blanks?.[id] ?? letter.letter, [blanks, id, letter.letter]);
  const [classNames, setClassNames] = useState(['hidden']);
  const delay = useRef(null);
  const [initialPosition, setInitialPosition] = useState(null);

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

  useEffect(() => {
    if (!turnOver && !fixedTiles?.includes(id) && !scoringTiles.length && !classNames.includes('tile')) {
      setClassNames((old) => [...old, 'tile']);
    }
  }, [classNames, dealing, fixedTiles, id, scoringTiles.length, turnOver])

  useEffect(() => {
    if (dealing && !bagTiles.includes(id) && classNames.includes('in-bag')) {
      setClassNames((old) => old.filter((c) => c !== 'in-bag'));
    }
  }, [bagTiles, classNames, dealing, id]);

  useEffect(() => {
    if (!dealing && classNames.includes('in-bag')) {
      setClassNames((old) => old.filter((c) => c !== 'in-bag'));
    }
  }, [bagTiles, classNames, dealing, id]);

  useEffect(() => {
    if (!dealing && classNames.includes('hidden')) {
      setClassNames((old) => old.filter((c) => c !== 'hidden'));
    }
  }, [bagTiles, classNames, dealing, id]);

  useEffect(() => {
    if (!dealing && classNames.includes('tile-base')) {
      setClassNames((old) => old.filter((c) => c !== 'tile-base'));
    }
  }, [classNames, dealing]);

  useEffect(() => {
    if (dealing && dealable && bagTiles.includes(id) && !classNames.includes('in-bag') && !classNames.includes('tile-base')) {
      delay.current = setTimeout(() => {
        setClassNames((old) => {
          setTimeout(() => {
            setClassNames((older) => [...older, 'tile-base'].filter((c) => c !== 'hidden'));
          }, 100);
          return [...old, 'in-bag']
        });
      }, 300);
    }
    return () => {
      clearTimeout(delay.current);
    }
  }, [bagTiles, classNames, dealable, dealing, id]);

  useEffect(() => {
    if (dealing) {
      let init = initialPosition;
      if (init) {
        return;
      }
      const domEl = document.getElementById(id);
      if (domEl) {
        const rect = domEl.getBoundingClientRect();
        const bagRect = document.querySelector('.bag').getBoundingClientRect();
        const xpos = (bagRect.width / 2) - (rect.width / 2) + bagRect.x;
        const ypos = bagRect.y + 8;
        init = { left: xpos - rect.x, top: ypos - rect.y };
        setInitialPosition(`#${id}.in-bag { transform: translate(${init?.left ?? -1000}px, ${init?.top ?? -1000}px); }`);
      }
    }
  }, [dealing, id, initialPosition]);

  useEffect(() => {
    if (roundOver && !classNames.includes('tile-base')) {
      const domEl = document.getElementById(id);
      if (domEl) {
        const rect = domEl.getBoundingClientRect();
        const bagRect = document.querySelector('.bag').getBoundingClientRect();
        const xpos = (bagRect.width / 2) - (rect.width / 2) + bagRect.x;
        const ypos = bagRect.y + 8;
        const init = { left: xpos - rect.x, top: ypos - rect.y };
        setInitialPosition(`#${id}.in-bag { transform: translate(${init?.left ?? -1000}px, ${init?.top ?? -1000}px); }`);
      }
      setClassNames((old) => [...old, 'tile-base']);
    }
  }, [classNames, id, roundOver]);

  return (
    <Box
      id={id}
      className={classNames.join(' ')}
      ref={setNodeRef}
      sx={{ touchAction: 'none', boxSizing: 'border-box', m: '3px', width: '44px', height: '44px', borderRadius: '4px', fontSize: '24px', ...style, backgroundColor: fixedTiles?.includes(id) ? 'gainsboro' : style.backgroundColor, display: 'flex', justifyContent: 'center', alignItems: 'center',  position: 'relative', zIndex: 3, pt: letter.multiplier ? 0.5 : 0,  ...sx }}
      {...listeners}
      {...attributes}
    >
      <style dangerouslySetInnerHTML={{ __html: initialPosition }} />
      {
        letter.multiplier ? (
          <Box sx={{ position: 'absolute', top: 0, left: 0, fontSize: '10px', color: 'white', backgroundColor: letter.scope === 'word' ? '#b02bb5' : '#11adab', px: '3px', borderRadius: '4px 2px 2px 2px' }}>
            {`x${letter.multiplier}`}
          </Box>
        ) : null
      }
      {
        letter.multiplier ? (
          <Tooltip arrow placement="top" title={(
            <Box sx={{ fontSize: 12, color: 'white',  borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant='h6'>{letter.letter}</Typography>
              <Typography variant='body2'>{letter.scope === 'letter' ? `${letter.multiplier} x ${letter.value} points` : `${letter.multiplier} x word score`}</Typography>
            </Box>
          )}>
            <span>
              {displayedLetter}
            </span>
          </Tooltip>
        ) : (<span>
          {displayedLetter}
        </span>)
      }
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
