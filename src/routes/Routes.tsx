import { Route, Routes as ReactRouterRoutes } from 'react-router-dom';
import LPSongs from "../pages/LPSongs.tsx";
import HomePage from "../pages/HomePage_full_tabs.tsx";

export const Routes = () => {

  return (
    <ReactRouterRoutes>
      <Route index element={<HomePage />} />
      <Route path="songs" element={<LPSongs />} />
    </ReactRouterRoutes>
  );
}
