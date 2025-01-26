import { Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import React, { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";

const Edge = ({ side }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: side,
    data: {
      accepts: ['tile', 'bonus.edge'],
    },
  });

  const color = useMemo(() => {
    if (isOver) {
      return 'lightblue';
    }
    return 'white';
  }, [isOver]);

  return (
    <Box sx={{ width: '50px', height: '50px', border: '1px solid lightgrey', backgroundColor: color, position: 'relative', m: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }} ref={setNodeRef}>
      <AddIcon />
    </Box>
  );
};

export default Edge;
