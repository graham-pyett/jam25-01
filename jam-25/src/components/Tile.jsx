import { Box, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useGameData } from "../providers/GameDataProvider";

const Tile = ({ sx, letter, id, dealable, disabled, bagTile }) => {
  const { blanks, fixedTiles, scoringTiles, bagTiles, dealing, turnOver, retrieving, swapTiles } = useGameData();
  const { attributes: dropLeftAttr, listeners: dropLeftList, setNodeRef: setNodeRefDropLeft } = useDroppable({ id: `${id}-left`, data: { accepts: 'tile' } });
  const { attributes: dropRightAttr, listeners: dropRightList, setNodeRef: setNodeRefDropRight } = useDroppable({ id: `${id}-right`, data: { accepts: 'tile' } });
  const { attributes, listeners, setNodeRef } = useDraggable({ id, disabled: bagTile || turnOver || dealing || retrieving.length || swapTiles.length || fixedTiles?.includes(id) || scoringTiles.length, data: { type: 'tile' } });
  const displayedLetter = useMemo(() => blanks?.[id] ?? letter.letter, [blanks, id, letter.letter]);
  const [classNames, setClassNames] = useState(['hidden']);
  const delay = useRef(null);
  const [initialPosition, setInitialPosition] = useState(null);

  const scoringTileTop = useMemo(() => scoringTiles?.find((t) => t.id === id && t.placement === 'top'), [id, scoringTiles]);
  const scoringTileLeft = useMemo(() => scoringTiles?.find((t) => t.id === id && t.placement === 'left'), [id, scoringTiles]);

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
  }, [classNames, fixedTiles, id, scoringTiles.length, turnOver])

  useEffect(() => {
    if (dealing && !bagTiles.includes(id) && classNames.includes('in-bag')) {
      setClassNames((old) => old.filter((c) => c !== 'in-bag'));
    }
  }, [bagTiles, classNames, dealing, id]);

  useEffect(() => {
    if (!dealing && !retrieving.length  && classNames.includes('in-bag')) {
      setClassNames((old) => old.filter((c) => c !== 'in-bag'));
    }
  }, [classNames, dealing, retrieving.length]);

  useEffect(() => {
    if (!swapTiles.length && classNames.includes('in-swap')) {
      setClassNames((old) => old.filter((c) => c !== 'in-swap'));
    }
  }, [classNames, swapTiles.length]);

  useEffect(() => {
    if (!dealing && classNames.includes('hidden')) {
      setClassNames((old) => old.filter((c) => c !== 'hidden'));
    }
  }, [classNames, dealing]);

  useEffect(() => {
    if (!dealing && !retrieving.length && !swapTiles.length && classNames.includes('tile-base')) {
      setClassNames((old) => old.filter((c) => c !== 'tile-base'));
    }
  }, [classNames, dealing, retrieving.length, swapTiles.length]);

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
    if (retrieving.length && dealable && bagTiles.includes(id) && !classNames.includes('in-bag')) {
      setClassNames((old) => {
        // setTimeout(() => {
        //   setClassNames((older) => [...older, 'in-bag']);
        // }, 100);
        return [...old, 'in-bag']
      });
    }
  }, [bagTiles, classNames, dealable, id, retrieving.length]);

  useEffect(() => {
    if (swapTiles.length && dealable && swapTiles.includes(id) && !classNames.includes('in-swap')) {
      setClassNames((old) => {
        // setTimeout(() => {
        //   setClassNames((older) => [...older, 'in-bag']);
        // }, 100);
        return [...old, 'tile-base', 'in-swap']
      });
    }
  }, [swapTiles, classNames, dealable, id, swapTiles.length]);

  useEffect(() => {
    if (dealing) {
      setTimeout(() => {
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
      }, 220);
    }
  }, [dealing, id, initialPosition]);

  useEffect(() => {
    if (retrieving.length && retrieving.includes(id) && !classNames.includes('tile-base')) {
      const domEl = document.getElementById(id);
      if (domEl) {
        const rect = domEl.getBoundingClientRect();
        const bagRect = document.querySelector('.bag').getBoundingClientRect();
        const xpos = (bagRect.width / 2) - (rect.width / 2) + bagRect.x;
        const ypos = bagRect.y + 8;
        const init = { left: xpos - rect.x, top: ypos - rect.y };
        setInitialPosition(`#${id}.in-bag { transform: translate(${init?.left ?? -1000}px, ${init?.top ?? -1000}px); z-index: -1 }`);
      }
      setClassNames((old) => [...old, 'tile-base']);
    }
  }, [classNames, id, retrieving]);

  return (
    <Box
      id={id}
      className={['general-tile', ...classNames].join(' ')}
      ref={setNodeRef}
      sx={{ touchAction: 'none', height: '50px', position: 'relative' }}
      {...listeners}
      {...attributes}
    >
      <style dangerouslySetInnerHTML={{ __html: initialPosition }} />
      <style dangerouslySetInnerHTML={{ __html: `#${id}.in-swap { transform: translateX(1000px) }` }} />
      <Box sx={{ opacity: disabled ? 0.6 : 1, position: 'absolute', top: 0, left: 0, boxSizing: 'border-box', m: '3px', width: '44px', height: '44px', touchAction: 'none', borderRadius: '4px', fontSize: '24px', ...style, backgroundColor: fixedTiles?.includes(id) ? 'gainsboro' : style.backgroundColor, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3, pt: letter.multiplier ? 0.5 : 0,  ...sx }}>
        {
          letter.multiplier ? (
            <Box sx={{ position: 'absolute', top: 0, left: 0, fontSize: '10px', color: 'white', backgroundColor: letter.scope === 'word' ? '#b02bb5' : '#11adab', px: '3px', borderRadius: '4px 2px 2px 2px' }}>
              x{letter.multiplier}
            </Box>
          ) : null
        }
        {
          letter.rarity ? (
            <Box sx={{ position: 'absolute', top: 0, right: 0, fontSize: '10px', color: 'white', backgroundColor: ['', '#7abf1f', '#34249c', '#b0102b'][letter.rarity], px: '3px', borderRadius: '2px 4px 2px 2px' }}>
              {['C', 'U', 'R', 'S'][letter.rarity]}
            </Box>
          ) : null
        }
        {
          letter.money ? (
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, fontSize: '10px', color: 'white', backgroundColor: '#a17e02', px: '3px', borderRadius: '2px 2px 2px 4px' }}>
              ${letter.money}
            </Box>
          ) : null
        }
        {
          letter.multiplier || letter.rarity || letter.money || bagTile ? (
            <Tooltip arrow placement="top" title={(
              <Box sx={{ fontSize: 12, color: 'white',  borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant='h6' sx={{ fontFamily: 'Orbitron'}}>{letter.letter}</Typography>
                {
                  letter.multiplier ? (<Typography variant='body2'>{letter.scope === 'letter' ? `${letter.multiplier} x ${letter.value} ${letter.value !== 1 ? 'points' : 'point'}` : `${letter.multiplier} x word score`}</Typography>)
                  : (<Typography variant='body2'>{letter.value} {letter.value !== 1 ? 'points' : 'point'}</Typography>)
                }
                {
                  letter.money ? (<Typography variant='body2'>+${letter.money}</Typography>)
                  : null
                }
                <Typography variant='overline' sx={{ fontFamily: 'Orbitron', fontSize: 8 }}>{letter.rarity ? ['Common', 'Uncommon', 'Rare', 'Shiny'][letter.rarity] : 'Common'}</Typography>
              </Box>
            )}>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>	
                {displayedLetter}
              </Box>
              <Box ref={setNodeRefDropLeft} {...dropLeftList} {...dropRightAttr} sx={{ height: '100%', width: '45%', position: 'absolute', left: 0 }} />
              <Box sx={{ height:'100%', width: '45%', position: 'absolute', right: 0 }} ref={setNodeRefDropRight} {...dropRightList} {...dropLeftAttr} />
            </Tooltip>
          ) : (<span>
            {displayedLetter}
          </span>)
        }
        <Box sx={{ position: 'absolute', bottom: displayedLetter.length > 2 ? -1 : 1, right: 4, fontSize: '10px', fontFamily: 'Orbitron' }}>
          {letter.value}
        </Box>
        <Tooltip arrow open={!!scoringTileTop} title={<span style={{ fontFamily: 'Orbitron', fontSize: 16, color: scoringTileTop?.score < 0 ? '#ff9ca7' : '#b3faaa'}}>
          {scoringTileTop?.score >= 0 ? '+' : ''} {scoringTileTop?.score ?? ''}
          {
            scoringTileLeft?.newMoney != null && scoringTileTop?.newMoney !== 0 ? <span style={{ color: scoringTileTop?.newMoney < 0 ? '#ff9ca7' : 'gold' }}>{scoringTileTop?.newMoney > 0 ? ` +$${scoringTileTop?.newMoney}` : ` -$${Math.abs(scoringTileTop?.newMoney)}`}</span> : null
          }
          </span>} placement="top">
          <Box sx={{ width: '100%', height: '100%', pointerEvents: 'none', position: 'absolute' }} />
        </Tooltip>
        <Tooltip arrow open={!!scoringTileLeft} title={<span style={{ fontFamily: 'Orbitron', fontSize: 16, color: scoringTileLeft?.score < 0 ? '#ff9ca7' : '#b3faaa'}}>
          {scoringTileLeft?.score >= 0 ? '+' : ''} {scoringTileLeft?.score ?? ''}
          {
            scoringTileLeft?.newMoney != null && scoringTileLeft?.newMoney !== 0 ? <span style={{ color: scoringTileLeft?.newMoney < 0 ? '#ff9ca7' : 'gold' }}>{scoringTileLeft?.newMoney > 0 ? ` +$${scoringTileLeft?.newMoney}` : ` -$${Math.abs(scoringTileLeft?.newMoney ?? 0)}`}</span> : null
          }
          </span>} placement="left">
          <Box sx={{ width: '100%', height: '100%', pointerEvents: 'none', position: 'absolute' }} />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Tile;
