import { Route, Routes } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import HomeLayout from "./layout/HomeLayout";
import History from "./pages/History";
import Analysis from "./pages/Analysis";
import Setting from "./pages/Setting";
import Today from "./pages/Today";
import ProtectedLanding from "./routes/ProtectedLanding";
import RequireOnboarding from "./routes/RequireOnboarding";
function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedLanding />}>
        <Route index element={<Onboarding />} />
      </Route>
      <Route path="/" element={<RequireOnboarding />}>
        <Route element={<HomeLayout />}>
          <Route path="/today" element={<Today />} />
          <Route path="/history" element={<History />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/settings" element={<Setting />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
