import { getTourData } from "../services/tourDataService.ts";
import HeaderWrapper from "../components/HeaderWrapper.tsx";

export const StatsPage = () => {


  const tourData = getTourData();


  // Stats
  const totalShows = tourData.shows.length;
  const uniqueSongs = new Set(
    tourData.shows.flatMap(show => {
      const sets = (show.setlist as any).sets?.set || [];
      return sets.flatMap((set: any) => {
        const songs = set.song || [];
        return songs
          .filter((song: any) => !song.tape)
          .map((song: any) => song.name);
      });
    })
  ).size;

  return (
<>
      <HeaderWrapper
        badge={"From Zero World Tour 2024-2026"}
        title={"Coming soon"}
        subtitle={"Live Show stats"}
        />


    <div className="min-h-screen bg-white">
      {/* Tour Stats */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h2 className="font-semibold text-slate-900 mb-2">
            From Zero World Tour 2024-2026
          </h2>
          <div className="flex gap-6 text-sm text-gray-600">
            <span>{totalShows} shows completed</span>
            <span>{uniqueSongs} unique songs played</span>
            <span>Last updated: Prague, Sep 28</span>
          </div>
        </div>
      </div>
    </div>
</>
  );
}
