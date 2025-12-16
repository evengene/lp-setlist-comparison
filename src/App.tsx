import { Route, Routes } from "react-router-dom";

import { Navigation } from './components/Navigation';
import { Footer } from "./components/Footer.tsx";
import HomePage from "./pages/HomePage_full_tabs.tsx";
import { LPSongs } from "./pages/LPSongs.tsx";
import { ComparisonPage } from "./pages/ComparisonPage.tsx";
import { StatsPage } from "./pages/StatsPage.tsx";


function App() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="flex-1">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="songs" element={<LPSongs />} />
          <Route path="comparison" element={<ComparisonPage />} />
          <Route path="stats" element={<StatsPage />} />
        </Routes>
      </main>


      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
