import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import HomeLayout from "./layout/HomeLayout";
import History from "./pages/History";
import Analysis from "./pages/Analysis";
import Setting from "./pages/Setting";
import Today from "./pages/Today";
import ProtectedLanding from "./routes/ProtectedLanding";
function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedLanding />}>
        <Route index element={<Landing />} />
      </Route>
      <Route element={<HomeLayout />}>
        <Route path="/today" element={<Today />} />
        <Route path="/history" element={<History />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/settings" element={<Setting />} />
      </Route>
    </Routes>
  );
}

export default App;
