import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mui/material";
import React from "react";

const Blank = ({ id }) => {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      accepts: ['tile'],
    }
  });

  return <Box id={id} key={id} ref={setNodeRef} sx={{ width: '50px', height: '50px', position: 'relative' }} />;
}

export default Blank;
