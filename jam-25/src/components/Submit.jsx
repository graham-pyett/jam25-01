import { Box, Button } from "@mui/material";
import React from "react";

const Submit = ({ onSubmit }) => {
  return (
    <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 153.14 }}>
      <Button variant='contained' color='primary' onClick={onSubmit} sx={{ width: '100%' }}>Submit</Button>
    </Box>
  );
};

export default Submit;
