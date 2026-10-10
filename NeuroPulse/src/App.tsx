import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import Results from "./pages/Results";
import History from "./pages/History";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="predict" element={<Predict />} />
        <Route path="results" element={<Results />} />
        <Route path="results/:id" element={<Results />} />
        <Route path="history" element={<History />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
