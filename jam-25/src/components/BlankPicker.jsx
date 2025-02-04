import { Box, Button, Dialog, DialogContent } from "@mui/material";
import React from "react";

const BlankPicker = ({ open, handleClick }) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('Q')}>Q</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('W')}>W</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('E')}>E</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('R')}>R</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('T')}>T</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('Y')}>Y</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('U')}>U</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('I')}>I</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('O')}>O</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('P')}>P</Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('A')}>A</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('S')}>S</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('D')}>D</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('F')}>F</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('G')}>G</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('H')}>H</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('J')}>J</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('K')}>K</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('L')}>L</Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('Z')}>Z</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('X')}>X</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('C')}>C</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('V')}>V</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('B')}>B</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('N')}>N</Button>
          <Button sx={{ minWidth: 36, px: 0.5, mx: 0.5, fontSize: 16, fontFamily: '"Orbitron", serif' }} onClick={() => handleClick('M')}>M</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BlankPicker;
