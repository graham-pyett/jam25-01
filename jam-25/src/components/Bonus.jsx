import { Box } from "@mui/material";
import React, { useMemo } from "react";
import { BONUSES } from "../upgrades";

const Bonus = ({ bonus }) => {
  const bon = useMemo(() => BONUSES[bonus] ?? bonus, [bonus]);
  if (!bon) {
    return null;
  }
  return (
    <Box sx={{ ...bon.style, width: 'calc(100% + 6px)', height: 'calc(100% + 6px)', borderRadius: 2, boxSizing: 'border-box', position: 'absolute', top: -3, left: -3, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, color: 'white' }}>
      {bon.text}
    </Box>
  );
};

export default Bonus;
