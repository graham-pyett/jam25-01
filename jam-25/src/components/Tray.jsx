import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mui/material";
import React from "react";

const Tray = ({ tiles }) => {
  const { isOver, setNodeRef } = useDroppable({ id: 'tray' });
  return (
    <Box ref={setNodeRef} sx={{ backgroundColor: 'whitesmoke', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mt: 4, mb: 2, borderRadius: '8px', border: '1px solid slategrey', p: 2, width: 500, minHeight: 100, flexWrap: 'wrap', position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
      {tiles}
    </Box>
  );
};

export default Tray;
