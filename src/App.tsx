import React from "react";
import AuthProvider from "./provider/authProvider";
import Routes from "./routes";
import { OverlayProvider } from "./provider/overleyProvider";

const App = () => {
  return (
    <OverlayProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </OverlayProvider>
  );
};

export default App;
