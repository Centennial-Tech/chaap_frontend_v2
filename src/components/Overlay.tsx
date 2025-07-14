import React, { useEffect } from "react";
import { useOverlay } from "../provider/overleyProvider";
import { Z_INDEX } from "../constants/zIndex";

const Overlay: React.FC = () => {
  const { isVisible, hideOverlay } = useOverlay();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hideOverlay();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [hideOverlay]);

  if (!isVisible) return null;

  return (
    <div
      id="global_overlay"
      style={{ zIndex: Z_INDEX.OVERLAY }}
      className="
          fixed inset-0
          bg-black/40
          flex items-center justify-center
        "
    ></div>
  );
};

export default Overlay;
