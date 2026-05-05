import { useEffect, useState } from "react";
import DistrictSelector from "./DistrictSelector";
import TimeBlockSwitch from "./TimeBlockSwitch";

export default function FilterBar({
  query,
  setQuery,
  selectedDistricts,
  setSelectedDistricts,
  timeBlock,
  setTimeBlock,
  availableOnly,
  setAvailableOnly,
  sortMode,
  setSortMode,
  resetFilters,
  refreshData,
  status,
  lastUpdated,
  error,
}) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    setOpen(!isMobile);
  }, []);

  const selectedDistrictText =
    selectedDistricts.length === 0
      ? "All districts"
      : selectedDistricts.length === 1
      ? selectedDistricts[0]
      : `${selectedDistricts.length} districts`;

  return (
    <div className="mb-5 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-stone-700">Search & Filters</p>
          <p className="mt-1 text-xs text-stone-500">
            {selectedDistrictText} · {timeBlock === "fullDay" ? "Full Day" : timeBlock === "before2pm" ? "Before 2pm" : "After 2pm"}
            {availableOnly ? " · Available only" : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>

      {open && (
        <div className="mt-4">
          <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_220px_620px] xl:items-end">
            <label>
              <span className="mb-1 block text-sm font-medium text-stone-600">
                Search venue / address / district
              </span>
              <input
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none ring-emerald-600 transition focus:ring-2"
                placeholder="Victoria Park, Sha Tin, Yuen Wo, 維園, 源禾..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>

            <label>
              <span className="mb-1 block text-sm font-medium text-stone-600">Sort</span>
              <select
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none ring-emerald-600 transition focus:ring-2"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
              >
                <option value="availability">Most available</option>
                <option value="district">District</option>
                <option value="venue">Venue name</option>
              </select>
            </label>

            <div>
              <span className="mb-1 block text-sm font-medium text-stone-600">
                Time / Availability
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <TimeBlockSwitch timeBlock={timeBlock} setTimeBlock={setTimeBlock} />

                <button
                  type="button"
                  onClick={() => setAvailableOnly(!availableOnly)}
                  className={`h-11 shrink-0 rounded-2xl border px-4 text-sm font-semibold transition ${
                    availableOnly
                      ? "border-emerald-200 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                      : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  Available only
                </button>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-11 shrink-0 rounded-2xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <DistrictSelector
            selectedDistricts={selectedDistricts}
            setSelectedDistricts={setSelectedDistricts}
          />
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-3 text-xs text-stone-500">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded bg-emerald-100 ring-1 ring-emerald-200" />
            Available
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded bg-stone-50 ring-1 ring-stone-100" />
            No available court shown
          </span>

          <span>Numbers mean available courts for that hourly session.</span>
        </div>

        <div className="flex items-center justify-end gap-3">
          <p className="text-right text-sm text-stone-500">
            Status: <span className="font-medium text-stone-800">{status}</span>
            {lastUpdated ? ` · refreshed ${lastUpdated.toLocaleTimeString()}` : ""}
          </p>

          <button
            type="button"
            onClick={refreshData}
            className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
          >
            Refresh
          </button>
        </div>
      </div>

      {(status === "sample" || status === "error") && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Live LCSD data could not be loaded. Error: {error}
        </div>
      )}
    </div>
  );
}
