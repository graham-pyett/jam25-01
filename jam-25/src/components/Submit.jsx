import { Box, Button, useMediaQuery } from "@mui/material";
import React from "react";

const Submit = ({ onSubmit }) => {
  const matches = useMediaQuery('(max-width:900px)');
  return (
    <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: matches ? '15vw' : 153.14 }}>
      <Button className="button end-turn" variant='contained' color='primary' onClick={onSubmit} sx={{ width: '100%' }}>Submit</Button>
    </Box>
  );
};

export default Submit;
