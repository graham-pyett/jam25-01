import { Box, ClickAwayListener, Tooltip, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { BONUSES } from "../upgrades";
import { useDroppable } from "@dnd-kit/core";
import { v4 } from "uuid";

const Bonus = ({ bonus, placed }) => {
  const bon = useMemo(() => BONUSES[bonus] ?? bonus, [bonus]);
  const [ttipOpen, setTtipOpen] = useState(false);
  const { setNodeRef } = useDroppable({
    id: v4(),
    disabled: !placed,
    data: {
      accepts: ['bomb'],
      bonus,
      placed,
    }
  });
  if (!bon) {
    return null;
  }
  return (
    <ClickAwayListener onClickAway={() => setTtipOpen(false)}>
      <Box onClick={() => setTtipOpen(!ttipOpen)} onClose={() => setTtipOpen(false)} ref={setNodeRef} sx={{ ...bon.style, width: 'calc(100% + 6px)', height: 'calc(100% + 6px)', borderRadius: 2, boxSizing: 'border-box', position: 'absolute', top: -3, left: -3, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, color: 'white' }}>
        <Tooltip open={ttipOpen} disableFocusListener disableHoverListener disableTouchListener arrow placement="top" title={(
          <Box sx={{ fontSize: 12, color: 'white',  borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant='h6' sx={{ fontSize: 14 }}>{bon.name}</Typography>
            <Typography variant='body2'>{bon.description}</Typography>
            <Typography variant='overline' sx={{ fontSize: 10 }}>{bon.rarity ? ['Common', 'Uncommon', 'Rare', 'Shiny'][bon.rarity] : 'Common'}</Typography>
          </Box>
        )}>
          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ position: 'absolute', top: 0, right: 0, fontSize: '10px', color: 'white', backgroundColor: ['#8f8a6f', '#7abf1f', '#34249c', '#b0102b'][bon.rarity], px: '3px', borderRadius: '2px 4px 2px 2px' }}>
              {['C', 'U', 'R', 'S'][bon.rarity]}
            </Box>
            {bon.text}
          </Box>
        </Tooltip>
      </Box>
    </ClickAwayListener>
  );
};

export default Bonus;
