// Z-Index Constants
// Higher numbers = higher priority (closer to user)

export const Z_INDEX = {
  // Background elements
  BACKGROUND: -1,
  
  // Base content
  BASE: 0,
  
  // Navigation and layout
  SIDEBAR: 10,
  MOBILE_MENU: 10,
  NAVIGATION: 20,
  
  // Interactive elements
  BUTTON: 30,
  DROPDOWN: 40,
  
  // Overlays and modals
  OVERLAY: 200,
  MODAL: 60,
  MODAL_STACK: 70, // For multiple modals
  
  // Top level elements
  HEADER: 80,
  CHATBOT: 90,
  
  // Highest priority
  TOOLTIP: 100,
  NOTIFICATION: 110,
} as const;

export type ZIndexKey = keyof typeof Z_INDEX; 