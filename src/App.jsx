import { useEffect, useMemo, useState } from "react";

import { loadSportData } from "./api/lcsd";
import AvailabilityTable from "./components/AvailabilityTable";
import BookingDateSelector from "./components/BookingDateSelector";
import FilterBar from "./components/FilterBar";
import Footer from "./components/Footer";
import MobileAvailabilityList from "./components/MobileAvailabilityList";
import SummaryCards from "./components/SummaryCards";
import { AFTER_6PM_HOURS, BEFORE_12_HOURS, FULL_DAY_HOURS, MIDDAY_HOURS } from "./config";
import { usePersistentState } from "./hooks/usePersistentState";
import { getNextBookingDatesHK, getTodayHK } from "./lib/dateTime";
import { buildVenueGrid } from "./lib/availabilityGrid";

const SPORT_COPY = {
  tennis: {
    title: "HK Tennis Court Availability",
    badge: "All HK LCSD tennis venues · 全港康文署網球場",
  },
  badminton: {
    title: "HK Badminton Court Availability",
    badge: "All HK LCSD badminton venues · 全港康文署羽毛球場",
  },
  squash: {
    title: "HK Squash Court Availability",
    badge: "HK squash courts · 香港壁球場",
  },
};

function getSafeSport(value) {
  return SPORT_COPY[value] ? value : "tennis";
}

function getSafeTimeBlock(value) {
  if (value === "after2pm") return "after6pm";
  if (value === "before2pm") return "before12";
  if (value === "before11") return "before12";
  if (value === "afternoon") return "midday";

  return ["fullDay", "before12", "midday", "after6pm"].includes(value)
    ? value
    : "fullDay";
}

function getSafeDistricts(value) {
  return Array.isArray(value) ? value : [];
}

function sortRows(rows) {
  return [...rows].sort(
    (a, b) =>
      b.totalAvailableCourtHours - a.totalAvailableCourtHours ||
      a.districtEN.localeCompare(b.districtEN) ||
      a.nameEN.localeCompare(b.nameEN)
  );
}

export default function App() {
  const [activeSport, setActiveSportRaw] = usePersistentState("hkcf.activeSport", "tennis");
  const [timeBlock, setTimeBlockRaw] = usePersistentState("hkcf.timeBlock", "fullDay");
  const [selectedDistricts, setSelectedDistrictsRaw] = usePersistentState(
    "hkcf.selectedDistricts",
    []
  );
  const [availableOnly, setAvailableOnly] = usePersistentState("hkcf.availableOnly", false);

  const safeActiveSport = getSafeSport(activeSport);
  const safeTimeBlock = getSafeTimeBlock(timeBlock);
  const safeSelectedDistricts = getSafeDistricts(selectedDistricts);

  const setActiveSport = (value) => setActiveSportRaw(getSafeSport(value));
  const setTimeBlock = (value) => setTimeBlockRaw(getSafeTimeBlock(value));
  const setSelectedDistricts = (value) => setSelectedDistrictsRaw(getSafeDistricts(value));

  const [venues, setVenues] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayHK());

  const copy = SPORT_COPY[safeActiveSport];

  useEffect(() => {
    document.title = copy.title;
  }, [copy.title]);

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
    setTimeBlock("fullDay");
    setSelectedDistricts([]);
    setAvailableOnly(false);
  }

  const visibleHours = useMemo(() => {
    if (safeTimeBlock === "before12") return BEFORE_12_HOURS;
    if (safeTimeBlock === "midday") return MIDDAY_HOURS;
    if (safeTimeBlock === "after6pm") return AFTER_6PM_HOURS;
    return FULL_DAY_HOURS;
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

    return sortRows(filtered);
  }, [
    venues,
    availability,
    selectedDate,
    visibleHours,
    query,
    safeSelectedDistricts,
    availableOnly,
  ]);

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-[1900px] px-4 py-2 sm:px-6 sm:py-3 lg:px-8">
          <p className="mb-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 sm:px-3 sm:py-1 sm:text-xs">
            {copy.badge}
          </p>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h1 className="max-w-5xl text-2xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {copy.title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
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

      <section className="mx-auto max-w-[1900px] px-4 py-2 sm:px-6 sm:py-3 lg:px-8">
        <div className="md:hidden">
          <SummaryCards activeSport={safeActiveSport} setActiveSport={setActiveSport} />
        </div>

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
          resetFilters={resetFilters}
          refreshData={loadData}
          status={status}
          error={error}
          visibleVenueCount={gridRows.length}
        />

        <MobileAvailabilityList
          gridRows={gridRows}
          activeSport={safeActiveSport}
          availableOnly={availableOnly}
          selectedDate={selectedDate}
        />

        <AvailabilityTable
          gridRows={gridRows}
          visibleHours={visibleHours}
          timeBlock={safeTimeBlock}
          activeSport={safeActiveSport}
          selectedDate={selectedDate}
        />
      </section>

      <Footer />
    </main>
  );
}









