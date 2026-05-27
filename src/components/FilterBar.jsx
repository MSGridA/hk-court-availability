import { useEffect, useState } from "react";
import DistrictSelector from "./DistrictSelector";
import TimeBlockSwitch from "./TimeBlockSwitch";

const TEXT = {
  en: {
    allDistricts: "All districts",
    districts: "districts",
    available: "Available",
    reset: "Reset",
    showing: "Showing",
    availableSuffix: "available",
    districtTitle: "Districts",
    districtSubtitle: "Choose one or more areas",
    done: "Done",
    searchPlaceholder: "Search venue / district...",
    clear: "Clear",
    loadingError: "Live LCSD data could not be loaded. Error:",
  },
  tc: {
    allDistricts: "全部地區",
    districts: "個地區",
    available: "只看有場",
    reset: "重設",
    showing: "顯示",
    availableSuffix: "有場",
    districtTitle: "地區",
    districtSubtitle: "選擇一個或多個地區",
    done: "完成",
    searchPlaceholder: "搜尋場地 / 地區...",
    clear: "清除",
    loadingError: "未能載入康文署即時資料。錯誤：",
  },
};

function getText(language) {
  return language === "tc" ? TEXT.tc : TEXT.en;
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a9 9 0 0 1-15.3 6.4" />
      <path d="M3 12A9 9 0 0 1 18.3 5.6" />
      <path d="M21 3v6h-6" />
      <path d="M3 21v-6h6" />
    </svg>
  );
}

function DistrictPanel({
  open,
  onClose,
  selectedDistricts,
  setSelectedDistricts,
  language,
}) {
  const t = getText(language);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 cursor-default bg-black/10 backdrop-blur-[1px]"
        aria-label="Close district selector"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 z-50 flex h-[92dvh] flex-col overflow-hidden rounded-t-3xl border border-stone-200 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-2xl md:inset-x-auto md:bottom-auto md:left-1/2 md:top-28 md:h-auto md:max-h-[78vh] md:w-[min(900px,calc(100vw-48px))] md:-translate-x-1/2 md:rounded-3xl md:pb-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-stone-900">{t.districtTitle}</p>
            <p className="text-xs text-stone-500">{t.districtSubtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 shadow-sm hover:bg-stone-50"
          >
            {t.done}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <DistrictSelector
            selectedDistricts={selectedDistricts}
            setSelectedDistricts={setSelectedDistricts}
            language={language}
          />
        </div>
      </div>
    </>
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
  visibleVenueCount,
  language = "en",
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const t = getText(language);

  const selectedDistrictText =
    selectedDistricts.length === 0
      ? t.allDistricts
      : selectedDistricts.length === 1
      ? language === "tc"
        ? "1個地區"
        : selectedDistricts[0]
      : language === "tc"
      ? `${selectedDistricts.length}${t.districts}`
      : `${selectedDistricts.length} ${t.districts}`;

  return (
    <div className="mb-2 space-y-1.5">
      <div className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
        <TimeBlockSwitch timeBlock={timeBlock} setTimeBlock={setTimeBlock} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setDistrictOpen(true)}
            className={`h-9 max-w-[38vw] shrink-0 truncate rounded-full border px-3 text-xs font-semibold shadow-sm transition sm:max-w-none ${
              districtOpen || selectedDistricts.length > 0
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900"
            }`}
          >
            {selectedDistrictText}
          </button>

          <span className="hidden rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-500 sm:inline-flex">
            {t.showing} {visibleVenueCount}
            {availableOnly ? ` ${t.availableSuffix}` : ""}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-2">
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

          <button
            type="button"
            onClick={refreshData}
            disabled={status === "loading"}
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-xs font-semibold text-stone-600 shadow-sm transition hover:bg-stone-50 hover:text-stone-900 ${
              status === "loading" ? "cursor-wait opacity-70" : ""
            }`}
            aria-label="Refresh live data"
            title="Refresh"
          >
            <span className={status === "loading" ? "animate-spin" : ""}>
              <RefreshIcon />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`h-9 shrink-0 rounded-full border px-2.5 text-[11px] font-semibold shadow-sm transition sm:px-3 sm:text-xs ${
              availableOnly
                ? "border-emerald-200 bg-emerald-600 text-white hover:bg-emerald-700"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900"
            }`}
          >
            {t.available}
          </button>

          <button
            type="button"
            onClick={resetFilters}
            className="h-9 shrink-0 rounded-full border border-stone-200 bg-white px-2.5 text-[11px] font-semibold text-stone-600 shadow-sm transition hover:bg-stone-50 hover:text-stone-900 sm:px-3 sm:text-xs"
          >
            {t.reset}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="flex h-9 items-center gap-2 rounded-full border border-stone-200 bg-white px-3 shadow-sm ring-emerald-600 transition focus-within:ring-2">
          <input
            className="w-full bg-transparent text-[16px] leading-none outline-none"
            placeholder={t.searchPlaceholder}
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
              {t.clear}
            </button>
          )}
        </div>
      )}

      <DistrictPanel
        open={districtOpen}
        onClose={() => setDistrictOpen(false)}
        selectedDistricts={selectedDistricts}
        setSelectedDistricts={setSelectedDistricts}
        language={language}
      />

      {(status === "sample" || status === "error") && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {t.loadingError} {error}
        </div>
      )}
    </div>
  );
}
