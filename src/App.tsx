import AuthProvider from "./provider/authProvider";
import Routes from "./routes";
import { OverlayProvider } from "./provider/overleyProvider";
import { SubmissionProvider } from "./provider/submissionProvider";

const App = () => {
  return (
    <OverlayProvider>
      <AuthProvider>
        <SubmissionProvider>
          <Routes />
        </SubmissionProvider>
      </AuthProvider>
    </OverlayProvider>
  );
};

export default App;
