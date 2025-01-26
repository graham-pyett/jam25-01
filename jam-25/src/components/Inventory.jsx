import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mui/material";
import React from "react";

const Inventory = ({ items }) => {
  const { setNodeRef } = useDroppable({ id: 'inventory' });
  return (
    <Box ref={setNodeRef} sx={{ minHeight: 50, backgroundColor: 'whitesmoke', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderRadius: '8px', border: '1px solid slategrey', p: 1, mb: 2 }}>
      {items}
    </Box>
  );
};

export default Inventory;
