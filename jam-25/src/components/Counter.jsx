import { useEffect, useRef, useState } from "react";

const useIncrement = (count) => {
  const [display, setDisplay] = useState(count);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (display !== count) {
      timeoutRef.current = setTimeout(() => {
        if (display < (count ?? 0)) setDisplay((prev) => prev + 1);
        if (display > (count ?? 0)) setDisplay((prev) => prev - 1);
      }, 10);
    }
    if (count == null) {
      if (display === 0) {
        setDisplay(null);
      }
    }
    return () => {
      clearTimeout(timeoutRef.current);
    }
  }, [count, display]);

  return display;
};

export default useIncrement;
