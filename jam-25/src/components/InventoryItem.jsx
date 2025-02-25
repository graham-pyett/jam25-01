import { Box } from "@mui/material";
import React from "react";
import Bonus from "./Bonus";
import { useDraggable } from "@dnd-kit/core";

const InventoryItem = ({ item }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: item.id, data: { type: `bonus.${item.placement}` } });
  return (
    <Box
      className="inventory-item draggable"
      ref={setNodeRef}
      key={item.id}
      sx={{ touchAction: 'none', width: 50, height: 50, position: 'relative', mr: 1, zIndex: 3 }}
      {...listeners}
      {...attributes}
    >
      <Bonus bonus={item} />
    </Box>
  );
}

export default InventoryItem;
