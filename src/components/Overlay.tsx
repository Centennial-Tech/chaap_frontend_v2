import React, { useEffect } from "react";
import { useOverlay } from "../provider/overleyProvider";

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
      className="
          fixed inset-0
          z-40
          bg-black/40
          flex items-center justify-center
        "
    ></div>
  );
};

export default Overlay;
