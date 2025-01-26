import { useDroppable } from "@dnd-kit/core";
import { Box, Button } from "@mui/material";
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import React from "react";

const Swapper = ({ tiles, handleSwap, swaps }) => {
  const { setNodeRef } = useDroppable({ id: 'swapper', disabled: tiles.length >= 5 || swaps === 0 });
  return (
    <Box ref={setNodeRef} sx={{ backgroundColor: 'plum', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid slategrey', px: 2, py: 1, pb: 6, minHeight: 120, minWidth: 150, maxWidth: 150, ml: 2, flexWrap: 'wrap' }}>
      {tiles}
      <Button disabled={swaps === 0} variant='contained' color='primary' sx={{ position: 'fixed', bottom: 8 }} onClick={handleSwap}><SwapCallsIcon /></Button>
    </Box>
  );
};

export default Swapper;
