import { Box } from "@mui/material";
import React, { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import Bonus from "./Bonus";

const Space = ({ tile, id, bonus, inventory, black }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: !!tile || black,
    data: {
      accepts: ['tile', 'bonus.board'],
    }
  });

  const color = useMemo(() => {
    if (isOver) {
      return 'rgba(58, 171, 189, 0.7)';
    }
    return 'rgba(32, 53, 212, 0.2)';
  }, [isOver]);

  if (black) {
    return (
      <Box sx={{ width: '50px', height: '50px', border: '1px solid rgba(0,0,0,0)', backgroundColor: 'rgba(0,0,0,0)' }} ref={setNodeRef} />
    );
  }

  return (
    <Box sx={{ width: '50px', height: '50px', border: '1px solid rgba(32, 53, 212, 0.4)', backgroundColor: color, position: 'relative' }} ref={setNodeRef}>
      {
        bonus && <Bonus bonus={bonus} placed={inventory ? id : null} />
      }
      {tile}
    </Box>
  );
};

export default Space;
