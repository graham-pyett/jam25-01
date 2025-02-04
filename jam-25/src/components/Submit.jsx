import { Box, Button, useMediaQuery } from "@mui/material";
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import React from "react";

const Submit = ({ onSubmit, disabled }) => {
  const matches = useMediaQuery('(max-width:900px)');
  return (
    <Box sx={{ ml: matches? 1 : 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: matches ? '10vw' : 120 }}>
      <Button disabled={disabled} className="button end-turn" variant='contained' color='primary' onClick={onSubmit} sx={{ width: matches ? '60%' : '100%', height: matches ? '60%' : undefined }}><SpellcheckIcon sx={{ mr: matches ? 0 : 0.5 }} />{matches ? '' : ' Submit'}</Button>
    </Box>
  );
};

export default Submit;
