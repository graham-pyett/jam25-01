import { Box } from "@mui/material";
import React from "react";
import Space from "./Space";

const Grid = ({ gridArray, inventory }) => {
  return (
    <Box sx={{ border: '2px solid slategrey', borderRadius: '4px' }}>
      {
        gridArray?.map((row, i) => (
          <Box key={i} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
            {
              row.map((space) => (
                <Space key={space.id} tile={space.tile} id={space.id} bonus={space.bonus} inventory={inventory} />
              ))
            }
          </Box>
        ))
      }
    </Box>
  );
};

export default Grid;
