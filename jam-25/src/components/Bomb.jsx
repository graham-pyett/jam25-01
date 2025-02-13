import { useDraggable } from "@dnd-kit/core";
import { Box, ClickAwayListener, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";

const Bomb = () => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: 'bomb', data: { type: 'bomb' } });
  const [ttipOpen, setTtipOpen] = useState(false);
  return (
    <Box
      className="inventory-item draggable"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{ width: 44, height: 44, borderRadius: 2, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, color: 'white', backgroundColor: '#f5c9d0' }}
    >
      <ClickAwayListener onClickAway={() => setTtipOpen(false)}>
        <Box sx={{ height: '100%', width: '100%' }} onClick={() => setTtipOpen(!ttipOpen)}>
          <Tooltip open={ttipOpen} onClose={() => setTtipOpen(false)} disableFocusListener disableHoverListener disableTouchListener arrow placement="top" title={(
            <Box sx={{ fontSize: 12, color: 'white',  borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant='body2'>Drag this on to a space to remove the existing bonus</Typography>
            </Box>
          )}>
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              💣
            </Box>
          </Tooltip>
        </Box>
      </ClickAwayListener>
    </Box>
  );
};

export default Bomb;
