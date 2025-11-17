import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import HomeLayout from "./layout/HomeLayout";
import History from "./pages/History";
import Analysis from "./pages/Analysis";
import Setting from "./pages/Setting";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<HomeLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/settings" element={<Setting />} />
      </Route>
    </Routes>
  );
}

export default App;
