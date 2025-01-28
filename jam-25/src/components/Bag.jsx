import { Box, Button, Dialog, DialogContent, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import InventoryTile from "./InventoryTile";

const Bag = ({ bag, allTiles }) => {
  const matches = useMediaQuery('(max-width:900px)');
  const [bagOpen, setBagOpen] = useState(false);
  return (
    <Box className="bag" sx={{ backgroundColor: '#564c59', color: 'white', p: matches ? 1 : 2, borderRadius: '8px', border: '1px solid ghostwhite', width: matches ? 'calc(25vw - 4px)' : 120, mr: matches ? 1 : 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between'}}><span><Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>Bag:</Typography></span><span><Typography variant='overline' sx={{ fontFamily: 'Orbitron' }}>{bag}</Typography></span></Box>
      <Button className="button" variant="contained" sx={{ mx: 'auto' }} onClick={() => setBagOpen(true)}>Open</Button>
      <Dialog open={bagOpen}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="overline" sx={{ fontFamily: 'Orbitron' }}>Bag Contents</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              {
                allTiles.map((t) => <InventoryTile key={t.id} tile={t} />)
              }
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button className="button" variant="contained" onClick={() => setBagOpen(false)}>Close</Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
};

export default Bag;
