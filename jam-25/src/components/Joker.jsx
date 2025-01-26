import { Box } from "@mui/material";
import React from "react";

const Joker = ({ sx, joker, id }) => {
  return (
    <Box
      sx={{ boxSizing: 'border-box', m: '3px', width: '44px', height: '44px', borderRadius: '4px', fontSize: '24px',  display: 'flex', justifyContent: 'center', alignItems: 'center',  position: 'relative', zIndex: 3, ...joker.style }}
    >
      {joker.text}
    </Box>
  );
};

export default Joker;
