import { useDroppable } from "@dnd-kit/core";
import { Box, Button, useMediaQuery } from "@mui/material";
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import React from "react";

const Swapper = ({ tiles, handleSwap, swaps }) => {
  const matches = useMediaQuery('(max-width: 900px)');
  const { setNodeRef } = useDroppable({ id: 'swapper', disabled: tiles.length >= 5 || swaps === 0 });
  return (
    <Box ref={setNodeRef} sx={{ order: matches ? 2 : 3, position: 'relative', backgroundColor: '#564c59', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid ghostwhite', px: 2, py: 1, pb: 6, minHeight: matches ? 60 : 120, width: matches ? 'calc(60vw - 8px)' : 150, ml: matches ? 1 : 2, flexWrap: 'wrap' }}>
      {tiles}
      <Button className="button" disabled={swaps === 0} variant='contained' color='primary' sx={{ position: 'absolute', bottom: 8 }} onClick={handleSwap}><SwapCallsIcon /></Button>
    </Box>
  );
};

export default Swapper;
