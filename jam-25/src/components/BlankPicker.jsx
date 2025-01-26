import { Box, Button, Dialog, DialogContent } from "@mui/material";
import React from "react";

const BlankPicker = ({ open, handleClick }) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('Q')}>Q</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('W')}>W</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('E')}>E</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('R')}>R</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('T')}>T</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('Y')}>Y</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('U')}>U</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('I')}>I</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('O')}>O</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('P')}>P</Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('A')}>A</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('S')}>S</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('D')}>D</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('F')}>F</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('G')}>G</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('H')}>H</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('J')}>J</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('K')}>K</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('L')}>L</Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('Z')}>Z</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('X')}>X</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('C')}>C</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('V')}>V</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('B')}>B</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('N')}>N</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16 }} onClick={() => handleClick('M')}>M</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BlankPicker;
