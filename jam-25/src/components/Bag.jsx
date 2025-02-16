import { Box, Button, Dialog, DialogContent, Typography, useMediaQuery } from "@mui/material";
import React, { useMemo } from "react";
import Tile from "./Tile";
import { v4 } from "uuid";

const Bag = ({ bag, getAllTiles, allTiles, bagOpen, setBagOpen, handleSwapChoice }) => {
  const matches = useMediaQuery('(max-width:767px)');
  const bagContents = useMemo(() => {
    if (bagOpen) {
      return getAllTiles() ?? [];
    }
    return [];
  }, [bagOpen, getAllTiles]);

  return (
    <Box className="bag" sx={{ isolation: 'isolate', zIndex: 10, position: 'relative', backgroundColor: '#564c59', color: 'white', p: matches ? 1 : 2, borderRadius: '8px', border: '1px solid ghostwhite', width: matches ? 'calc(25vw - 4px)' : 120, mr: matches ? 1 : 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between'}}><span><Typography variant='overline'>Bag:</Typography></span><span><Typography variant='overline'>{bag}</Typography></span></Box>
      <Button className="button" variant="contained" sx={{ mx: 'auto' }} onClick={() => setBagOpen(true)}>Open</Button>
      <Dialog open={bagOpen}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="overline">Bag Contents</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              {
                bagContents.map((tile) => {
                  const newId = v4();
                  return (
                    <Button key={tile.id} onClick={() => handleSwapChoice(tile)} sx={{ m: 0, p: 0, minWidth: 0, color: 'unset!important' }}>
                      <Tile letter={{ ...tile, id: newId }} id={newId} bagTile disabled={!allTiles.find((t) => t.props.id === tile.id)} />
                    </Button>
                  );
                })
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
