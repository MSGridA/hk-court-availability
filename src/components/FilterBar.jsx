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

function getTimeBlockLabel(timeBlock) {
  if (timeBlock === "fullDay") return "Full";
  if (timeBlock === "before12") return "Before 12";
  if (timeBlock === "midday") return "12–6";
  return "After 6";
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
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const selectedDistrictText =
    selectedDistricts.length === 0
      ? "All districts"
      : selectedDistricts.length === 1
      ? selectedDistricts[0]
      : `${selectedDistricts.length} districts`;

  return (
    <div className="mb-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-stone-700">Search & Filters</p>
          <p className="mt-0.5 truncate text-xs text-stone-500">
            {selectedDistrictText} · {getTimeBlockLabel(timeBlock)}
            {availableOnly ? " · Available only" : ""}
            {query ? ` · Search: ${query}` : ""}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold transition ${
              searchOpen || query
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900"
            }`}
            aria-label="Search venue, address, or district"
            title="Search"
          >
            <SearchIcon />
          </button>

          <button
            type="button"
            onClick={refreshData}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-xs font-semibold text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
            aria-label="Refresh live data"
            title="Refresh"
          >
            <RefreshIcon />
          </button>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
          >
            {open ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="mt-3">
          <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 ring-emerald-600 transition focus-within:ring-2">
            <span className="text-stone-400">
              <SearchIcon />
            </span>

            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Search venue, address, or district..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded-full px-2 py-1 text-xs font-semibold text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {open && (
        <div className="mt-3">
          <TimeBlockSwitch timeBlock={timeBlock} setTimeBlock={setTimeBlock} />

          <DistrictSelector
            selectedDistricts={selectedDistricts}
            setSelectedDistricts={setSelectedDistricts}
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`h-9 shrink-0 rounded-2xl border px-3 text-xs font-semibold transition ${
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
              className="h-9 shrink-0 rounded-2xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {(status === "sample" || status === "error") && (
        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Live LCSD data could not be loaded. Error: {error}
        </div>
      )}
    </div>
  );
}
