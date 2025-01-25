import { Box } from "@mui/material";
import React from "react";
import { useDraggable } from "@dnd-kit/core";

const Tile = ({ sx, letter, id }) => {
  const { attributes, listeners, setNodeRef, over } = useDraggable({ id });
  return (
    <Box
      ref={setNodeRef}
      sx={{ m: '3px', width: '44px', height: '44px', borderRadius: '4px', border: '1px solid tan', backgroundColor: 'antiquewhite', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', position: 'relative', boxSizing: 'border-box', ...sx }}
      {...listeners}
      {...attributes}
    >
      {letter.letter}
      <Box sx={{ position: 'absolute', bottom: 1, right: 4, fontSize: '10px' }}>
        {letter.value}
      </Box>
    </Box>
  );
};

export default Tile;
