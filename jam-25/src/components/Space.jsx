import { Box } from "@mui/material";
import React, { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import Bonus from "./Bonus";

const Space = ({ tile, id, bonus }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: !!tile,
    data: {
      accepts: ['tile', 'bonus.board'],
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
      {
        bonus && <Bonus bonus={bonus} />
      }
      {tile}
    </Box>
  );
};

export default Space;
