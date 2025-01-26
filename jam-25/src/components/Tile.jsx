import { Box } from "@mui/material";
import React, { useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useGameData } from "../providers/GameDataProvider";

const Tile = ({ sx, letter, id }) => {
  const { blanks, fixedTiles } = useGameData();
  const { attributes, listeners, setNodeRef } = useDraggable({ id, disabled: fixedTiles?.includes(id), data: { type: 'tile' } });
  const displayedLetter = useMemo(() => blanks?.[id] ?? letter.letter, [blanks, id, letter.letter]);

  const style = useMemo(() => {
    let newStyle = { border: '1px solid tan', backgroundColor: 'antiquewhite' };
    if (letter.style) {
      newStyle = { border: letter.style.border, backgroundColor: letter.style.backgroundColor, color: letter.style.color };
    }
    if (letter.isBlank) {
      newStyle = { border: '2px solid darkmagenta', color: 'darkmagenta', ...newStyle, };
    }
    if (displayedLetter.length === 3) {
      newStyle = { fontSize: '18px', ...newStyle };
    }
    if (displayedLetter.length === 4) {
      newStyle = { fontSize: '16px', ...newStyle };
    }

     return newStyle;
  }, [displayedLetter?.length, letter?.isBlank, letter?.style]);

  return (
    <Box
      ref={setNodeRef}
      sx={{ boxSizing: 'border-box', m: '3px', width: '44px', height: '44px', borderRadius: '4px', fontSize: '24px', ...style, backgroundColor: fixedTiles?.includes(id) ? 'gainsboro' : style.backgroundColor, display: 'flex', justifyContent: 'center', alignItems: 'center',  position: 'relative', zIndex: 3, ...sx }}
      {...listeners}
      {...attributes}
    >
      {
        (letter.multiplier || letter.adder) && (
          <Box sx={{ position: 'absolute', top: 1, left: 4, fontSize: '10px', color: letter.adder ? '#4fdb82' : '#c9402a' }}>
            {letter.adder ? `+${letter.adder}` : `x${letter.multiplier}`}
          </Box>
        )
      }

      {displayedLetter}
      <Box sx={{ position: 'absolute', bottom: 1, right: 4, fontSize: '10px' }}>
        {letter.value}
      </Box>
    </Box>
  );
};

export default Tile;
