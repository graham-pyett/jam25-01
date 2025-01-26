import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mui/material";
import React from "react";

const Tray = ({ tiles }) => {
  const { setNodeRef } = useDroppable({ id: 'tray' });
  return (
    <Box ref={setNodeRef} sx={{ backgroundColor: 'whitesmoke', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid slategrey', p: 2, width: 400, minHeight: 120, flexWrap: 'wrap' }}>
      {tiles}
    </Box>
  );
};

export default Tray;
