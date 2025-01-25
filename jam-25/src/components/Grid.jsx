import { Box } from "@mui/material";
import React from "react";
import Space from "./Space";

const Grid = ({ gridArray, validArray }) => {
  return (
    <Box sx={{ border: '2px solid slategrey', borderRadius: '4px' }}>
      {
        gridArray.map((row, i) => (
          <Box key={i} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
            {
              row.map((tile, j) => (
                <Space key={`${i},${j}`} tile={tile} id={`${i},${j}`} valid={validArray[i][j]} />
              ))
            }
          </Box>
        ))
      }
    </Box>
  );
};

export default Grid;
