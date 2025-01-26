import { Box } from "@mui/material";
import React, { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";

const InventoryTile = ({ tile, id, bonus }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      accepts: ['tile', 'bonus.tile'],
    }
  });

  const color = useMemo(() => {
    if (isOver) {
      return 'lightblue';
    }
    return 'white';
  }, [isOver]);

  return (
    <Box sx={{ width: '50px', height: '50px', border: '1px solid lightgrey', backgroundColor: color, position: 'relative' }} ref={setNodeRef}>
      {tile}
    </Box>
  );
};

export default InventoryTile;
