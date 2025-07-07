import { createContext, useContext, useState } from "react";

import type { ReactNode, FC } from "react";
import Overlay from "../components/Overlay";

interface OverlayContextType {
  isVisible: boolean;
  showOverlay: () => void;
  hideOverlay: () => void;
}

export const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const OverlayProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showOverlay = () => setIsVisible(true);
  const hideOverlay = () => setIsVisible(false);

  return (
    <OverlayContext.Provider value={{ isVisible, showOverlay, hideOverlay }}>
      {children}
      <Overlay />
    </OverlayContext.Provider>
  );
};

export const useOverlay = (): OverlayContextType => {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlay must be used within OverlayProvider");
  return ctx;
};
