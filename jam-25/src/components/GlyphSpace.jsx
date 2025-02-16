import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mui/material";
import React, { useMemo } from "react";
import { useGameData } from "../providers/GameDataProvider";

const GlyphSpace = ({ glyph, isGarbage = false, id }) => {
  const { shopOpen } = useGameData();
  const { isOver, setNodeRef } = useDroppable({
    id: isGarbage ? 'garbage' : id,
    data: {
      accepts: ['glyph'],
    }
  });

  const color = useMemo(() => {
    if (shopOpen && isOver) {
      return 'lightblue';
    }
    return 'whitesmoke';
  }, [shopOpen, isOver]);

  return (
    <Box id={id} ref={setNodeRef} sx={{ width: '50px', height: '50px', border: '1px solid lightgrey', position: 'relative', backgroundColor: color }}>
      {isGarbage ? (
        <Box sx={{ m: '3px', width: '44px', height: '44px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, backgroundColor: '#f5c9d0' }}>
          🗑️
        </Box>
      ) : glyph}
    </Box>
  );
};

export default GlyphSpace;
