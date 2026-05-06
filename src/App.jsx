import { useEffect, useMemo, useState } from "react";

import { loadSportData } from "./api/lcsd";
import AvailabilityTable from "./components/AvailabilityTable";
import BookingDateSelector from "./components/BookingDateSelector";
import FilterBar from "./components/FilterBar";
import Footer from "./components/Footer";
import MobileAvailabilityList from "./components/MobileAvailabilityList";
import SummaryCards from "./components/SummaryCards";
import { AFTER_2PM_HOURS, BEFORE_2PM_HOURS, FULL_DAY_HOURS } from "./config";
import { usePersistentState } from "./hooks/usePersistentState";
import { getNextBookingDatesHK, getTodayHK } from "./lib/dateTime";
import { buildVenueGrid } from "./lib/availabilityGrid";

const SPORT_COPY = {
  tennis: {
    title: "HK Tennis Court Availability",
    subtitle: "Move a little today, feel better tomorrow.",
    badge: "All HK LCSD tennis venues · 全港康文署網球場",
  },
  badminton: {
    title: "HK Badminton Court Availability",
    subtitle: "Move a little today, feel better tomorrow.",
    badge: "All HK LCSD badminton venues · 全港康文署羽毛球場",
  },
  squash: {
    title: "HK Squash Court Availability",
    subtitle: "Move a little today, feel better tomorrow.",
    badge: "HK squash courts · 香港壁球場",
  },
};

function getSafeSport(value) {
  return SPORT_COPY[value] ? value : "tennis";
}

function getSafeTimeBlock(value) {
  return value === "before2pm" || value === "after2pm" || value === "fullDay"
    ? value
    : "after2pm";
}

function getSafeDistricts(value) {
  return Array.isArray(value) ? value : [];
}

function getSafeSortMode(value) {
  return ["availability", "district", "venue"].includes(value) ? value : "availability";
}

function sortRows(rows, sortMode) {
  const sorted = [...rows];

  if (sortMode === "district") {
    return sorted.sort(
      (a, b) =>
        a.districtEN.localeCompare(b.districtEN) ||
        a.nameEN.localeCompare(b.nameEN)
    );
  }

  if (sortMode === "venue") {
    return sorted.sort(
      (a, b) =>
        a.nameEN.localeCompare(b.nameEN) ||
        a.districtEN.localeCompare(b.districtEN)
    );
  }

  return sorted.sort(
    (a, b) =>
      b.totalAvailableCourtHours - a.totalAvailableCourtHours ||
      a.districtEN.localeCompare(b.districtEN) ||
      a.nameEN.localeCompare(b.nameEN)
  );
}

export default function App() {
  const [activeSport, setActiveSportRaw] = usePersistentState("hkcf.activeSport", "tennis");
  const [timeBlock, setTimeBlockRaw] = usePersistentState("hkcf.timeBlock", "after2pm");
  const [selectedDistricts, setSelectedDistrictsRaw] = usePersistentState(
    "hkcf.selectedDistricts",
    []
  );
  const [availableOnly, setAvailableOnly] = usePersistentState("hkcf.availableOnly", false);
  const [sortMode, setSortModeRaw] = usePersistentState("hkcf.sortMode", "availability");

  const safeActiveSport = getSafeSport(activeSport);
  const safeTimeBlock = getSafeTimeBlock(timeBlock);
  const safeSelectedDistricts = getSafeDistricts(selectedDistricts);
  const safeSortMode = getSafeSortMode(sortMode);

  const setActiveSport = (value) => setActiveSportRaw(getSafeSport(value));
  const setTimeBlock = (value) => setTimeBlockRaw(getSafeTimeBlock(value));
  const setSelectedDistricts = (value) => setSelectedDistrictsRaw(getSafeDistricts(value));
  const setSortMode = (value) => setSortModeRaw(getSafeSortMode(value));

  const [venues, setVenues] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayHK());

  const copy = SPORT_COPY[safeActiveSport];

  async function loadData() {
    setStatus("loading");
    setError("");

    const result = await loadSportData(safeActiveSport);

    setVenues(result.venues);
    setAvailability(result.availability);
    setStatus(result.status);
    setError(result.error);
    setLastUpdated(new Date());
  }

  useEffect(() => {
    loadData();

    const timer = window.setInterval(loadData, 5 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [safeActiveSport]);

  const availableDates = useMemo(() => {
    return getNextBookingDatesHK(7);
  }, []);

  useEffect(() => {
    if (!availableDates.includes(selectedDate)) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  function resetFilters() {
    setQuery("");
    setSelectedDate(getTodayHK());
    setTimeBlock("after2pm");
    setSelectedDistricts([]);
    setAvailableOnly(false);
    setSortMode("availability");
  }

  const visibleHours = useMemo(() => {
    if (safeTimeBlock === "before2pm") return BEFORE_2PM_HOURS;
    if (safeTimeBlock === "fullDay") return FULL_DAY_HOURS;
    return AFTER_2PM_HOURS;
  }, [safeTimeBlock]);

  const gridRows = useMemo(() => {
    const rows = buildVenueGrid(venues, availability, selectedDate, visibleHours);
    const search = query.trim().toLowerCase();
    const allDistricts = safeSelectedDistricts.length === 0;

    const filtered = rows.filter((row) => {
      if (!allDistricts && !safeSelectedDistricts.includes(row.districtEN)) return false;

      if (availableOnly && row.totalAvailableCourtHours <= 0) return false;

      if (!search) return true;

      return [
        row.districtEN,
        row.districtTC,
        row.nameEN,
        row.nameTC,
        row.addressEN,
        row.addressTC,
        row.phone,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });

    return sortRows(filtered, safeSortMode);
  }, [
    venues,
    availability,
    selectedDate,
    visibleHours,
    query,
    safeSelectedDistricts,
    availableOnly,
    safeSortMode,
  ]);

  const hasTable =
    safeActiveSport === "tennis" ||
    safeActiveSport === "badminton" ||
    safeActiveSport === "squash";

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-[1900px] px-4 py-8 sm:px-6 lg:px-8">
          <p className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
            {copy.badge}
          </p>

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h1 className="max-w-5xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {copy.title}
              </h1>

              <p className="mt-4 max-w-4xl text-base leading-7 text-stone-600">
                {copy.subtitle}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    status === "ready"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                      : status === "loading"
                      ? "bg-stone-100 text-stone-600 ring-1 ring-stone-200"
                      : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                  }`}
                >
                  {status === "ready" ? "Live data" : status === "loading" ? "Loading data" : "Data warning"}
                </span>

                {lastUpdated && (
                  <span className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500 ring-1 ring-stone-200">
                    Updated {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>

            <div className="hidden shrink-0 md:block">
              <SummaryCards
                activeSport={safeActiveSport}
                setActiveSport={setActiveSport}
                variant="hero"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1900px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="md:hidden">
          <SummaryCards activeSport={safeActiveSport} setActiveSport={setActiveSport} />
        </div>

        {hasTable ? (
          <>
            <BookingDateSelector
              availableDates={availableDates}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            <FilterBar
              query={query}
              setQuery={setQuery}
              selectedDistricts={safeSelectedDistricts}
              setSelectedDistricts={setSelectedDistricts}
              timeBlock={safeTimeBlock}
              setTimeBlock={setTimeBlock}
              availableOnly={availableOnly}
              setAvailableOnly={setAvailableOnly}
              sortMode={safeSortMode}
              setSortMode={setSortMode}
              resetFilters={resetFilters}
              refreshData={loadData}
              status={status}
              lastUpdated={lastUpdated}
              error={error}
            />

            <MobileAvailabilityList
              gridRows={gridRows}
              activeSport={safeActiveSport}
              availableOnly={availableOnly}
            />

            <AvailabilityTable
              gridRows={gridRows}
              visibleHours={visibleHours}
              timeBlock={safeTimeBlock}
              activeSport={safeActiveSport}
            />
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-stone-400">
              Module prepared
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-stone-950">
              Module comes next
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-stone-600">
              The shortcut is in place. Next we need to confirm the official live availability endpoint
              before connecting the table.
            </p>

            <button
              type="button"
              className="mt-6 rounded-2xl bg-stone-950 px-5 py-3 font-medium text-white transition hover:bg-stone-800"
              onClick={() => setActiveSport("tennis")}
            >
              Back to Tennis
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}



