import { Box } from "@mui/material";
import React from "react";

const JokerSpace = ({ joker, id, bonus }) => {
  // const { isOver, setNodeRef } = useDroppable({
  //   id,
  //   data: {
  //     accepts: ['tile', 'bonus.tile'],
  //   }
  // });

  // const color = useMemo(() => {
  //   if (isOver) {
  //     return 'lightblue';
  //   }
  //   return 'white';
  // }, [isOver]);

  return (
    <Box sx={{ width: '50px', height: '50px', border: '1px solid lightgrey', position: 'relative', backgroundColor: 'whitesmoke' }}>
      {joker}
    </Box>
  );
};

export default JokerSpace;
