import { useDroppable } from "@dnd-kit/core";
import { Box, useMediaQuery } from "@mui/material";
import React from "react";

const Tray = ({ tiles }) => {
  const matches = useMediaQuery('(max-width: 900px)');
  const { setNodeRef } = useDroppable({ id: 'tray' });
  return (
    <Box ref={setNodeRef} sx={{ mt: matches ? 1 : 'unset', order: matches ? 3 : 2, background: 'whitesmoke', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid slategrey', p: matches ? 1 : 2, width: matches ? '100vw' : 400, minHeight: matches ? 100 : 120, flexWrap: 'wrap' }}>
      {tiles}
    </Box>
  );
};

export default Tray;
