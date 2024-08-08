import { LoadNeedsProvider } from "./hooks/LoadNeedsContext";
import AppNavigation from "./navigations/AppNavigation";

export default function App() {
  return (
    <LoadNeedsProvider>
      <AppNavigation />
    </LoadNeedsProvider>
  );
}
