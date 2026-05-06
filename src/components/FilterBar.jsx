import { useState } from "react";
import DistrictSelector from "./DistrictSelector";
import TimeBlockSwitch from "./TimeBlockSwitch";

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 0 1-15.3 6.4" />
      <path d="M3 12A9 9 0 0 1 18.3 5.6" />
      <path d="M21 3v6h-6" />
      <path d="M3 21v-6h6" />
    </svg>
  );
}

export default function FilterBar({
  query,
  setQuery,
  selectedDistricts,
  setSelectedDistricts,
  timeBlock,
  setTimeBlock,
  availableOnly,
  setAvailableOnly,
  resetFilters,
  refreshData,
  status,
  error,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);

  const selectedDistrictText =
    selectedDistricts.length === 0
      ? "All districts"
      : selectedDistricts.length === 1
      ? selectedDistricts[0]
      : `${selectedDistricts.length} districts`;

  return (
    <div className="mb-3 space-y-2">
      <div className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
        <TimeBlockSwitch timeBlock={timeBlock} setTimeBlock={setTimeBlock} />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setDistrictOpen(!districtOpen)}
          className={`h-9 shrink-0 rounded-full border px-3 text-xs font-semibold shadow-sm transition ${
            districtOpen || selectedDistricts.length > 0
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900"
          }`}
        >
          {districtOpen ? "Hide districts" : selectedDistrictText}
        </button>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition ${
              searchOpen || query
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900"
            }`}
            aria-label="Search venue, address, or district"
            title="Search"
          >
            <SearchIcon />
          </button>

          {searchOpen && (
            <div className="min-w-[220px] flex-1 sm:w-[320px] sm:flex-none">
              <div className="flex h-9 items-center gap-2 rounded-full border border-stone-200 bg-white px-3 shadow-sm ring-emerald-600 transition focus-within:ring-2">
                <input
                  className="w-full bg-transparent text-xs outline-none"
                  placeholder="Search venue / district..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-[11px] font-semibold text-stone-400 hover:text-stone-700"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={refreshData}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-xs font-semibold text-stone-600 shadow-sm transition hover:bg-stone-50 hover:text-stone-900"
            aria-label="Refresh live data"
            title="Refresh"
          >
            <RefreshIcon />
          </button>

          <button
            type="button"
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`h-9 shrink-0 rounded-full border px-3 text-xs font-semibold shadow-sm transition ${
              availableOnly
                ? "border-emerald-200 bg-emerald-600 text-white hover:bg-emerald-700"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900"
            }`}
          >
            Available only
          </button>

          <button
            type="button"
            onClick={resetFilters}
            className="h-9 shrink-0 rounded-full border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-600 shadow-sm transition hover:bg-stone-50 hover:text-stone-900"
          >
            Reset
          </button>
        </div>
      </div>

      {districtOpen && (
        <DistrictSelector
          selectedDistricts={selectedDistricts}
          setSelectedDistricts={setSelectedDistricts}
        />
      )}

      {(status === "sample" || status === "error") && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Live LCSD data could not be loaded. Error: {error}
        </div>
      )}
    </div>
  );
}
