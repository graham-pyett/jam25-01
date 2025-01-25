import { Box } from "@mui/material";
import React, { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";

const Space = ({ tile, id, valid }) => {
  const { isOver, setNodeRef } = useDroppable({ id, disabled: !!tile });

  const color = useMemo(() => {
    if (isOver) {
      return 'lightblue';
    }
    return valid === 'valid' ? 'lightgreen' : valid === 'invalid' ? 'lightcoral' : 'white';
  }, [isOver, valid]);

  return (
    <Box sx={{ width: '50px', height: '50px', border: '1px solid lightgrey', backgroundColor: color }} ref={setNodeRef}>
      {tile}
    </Box>
  );
};

export default Space;
