import { useDraggable } from "@dnd-kit/core";
import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";

const Bomb = () => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: 'bomb', data: { type: 'bomb' } });
  return (
    <Box
      className="inventory-item"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{ width: 44, height: 44, borderRadius: 2, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, color: 'white', backgroundColor: '#f5c9d0' }}
    >
      <Tooltip arrow placement="top" title={(
        <Box sx={{ fontSize: 12, color: 'white',  borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant='body2'>Drag this on to a space to remove the existing bonus</Typography>
        </Box>
      )}>
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          💣
        </Box>
      </Tooltip>
    </Box>
  );
};

export default Bomb;
