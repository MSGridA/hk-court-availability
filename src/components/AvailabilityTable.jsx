import { useEffect, useState } from "react";
import { SMARTPLAY_URL } from "../config";
import { makeGoogleMapUrl } from "../lib/maps";

const SPORT_TABLE_COPY = {
  tennis: {
    venueLabel: "Tennis venue",
    noResult: "No tennis venues match your filters.",
  },
  badminton: {
    venueLabel: "Badminton venue",
    noResult: "No badminton venues match your filters.",
  },
  squash: {
    venueLabel: "Squash venue",
    noResult: "No squash venues match your filters, or the live endpoint is unavailable.",
  },
};

function getCellClass(count) {
  if (count > 0) {
    return "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300 hover:bg-emerald-200";
  }

  return "bg-stone-100 text-stone-300 ring-1 ring-stone-200";
}

function getCurrentHourHK(selectedDate) {
  const now = new Date();

  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = dateParts.find((part) => part.type === "year")?.value;
  const month = dateParts.find((part) => part.type === "month")?.value;
  const day = dateParts.find((part) => part.type === "day")?.value;
  const todayHK = `${year}-${month}-${day}`;

  if (selectedDate !== todayHK) return null;

  const hourText = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Hong_Kong",
    hour: "2-digit",
    hourCycle: "h23",
  }).format(now);

  return Number(hourText);
}

function getHourColumnClass(hour, hoveredHour, currentHour) {
  if (currentHour === hour) return "bg-amber-100/80 ring-1 ring-amber-200";
  if (hoveredHour === hour) return "bg-emerald-50";
  return hour % 2 === 0 ? "bg-stone-200/70" : "bg-white";
}

function getHeaderHourClass(hour, hoveredHour, currentHour) {
  if (currentHour === hour) return "bg-amber-200/80 text-amber-900 ring-1 ring-amber-300";
  if (hoveredHour === hour) return "bg-emerald-100 text-emerald-800";
  return hour % 2 === 0 ? "bg-stone-300/60" : "";
}

function getAvailableSlots(venue) {
  return venue.hourly.filter((cell) => cell.availableCourts > 0);
}

function VenueDrawer({ venue, onClose }) {
  useEffect(() => {
    if (!venue) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [venue, onClose]);

  if (!venue) return null;

  const availableSlots = getAvailableSlots(venue);

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 hidden cursor-default bg-transparent md:block"
        aria-label="Close venue details"
        onClick={onClose}
      />

      <div className="fixed bottom-4 left-1/2 z-50 hidden w-[min(920px,calc(100vw-32px))] -translate-x-1/2 rounded-3xl border border-stone-200 bg-white p-4 shadow-2xl md:block">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 inline-flex rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-semibold text-stone-600">
              {language === "tc" ? venue.districtTC || venue.districtEN : venue.districtEN}
              {language === "tc" ? "" : venue.districtTC ? ` · ${venue.districtTC}` : ""}
            </div>

            <p className="font-semibold text-stone-950">{venue.nameEN}</p>

            {venue.nameTC && (
              <p className="mt-0.5 text-xs text-stone-600">{venue.nameTC}</p>
            )}

            <p className="mt-1 text-xs text-stone-500">
              {venue.addressEN || "Address not provided"}
              {venue.addressTC ? ` · ${venue.addressTC}` : ""}
            </p>

            <p className="mt-2 text-xs text-stone-500">
              Available:{" "}
              {availableSlots.length > 0
                ? availableSlots
                    .map((cell) => `${cell.label} (${cell.availableCourts})`)
                    .join(" · ")
                : "No available court shown in this time block."}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap justify-end gap-2 text-xs">
            {venue.phone && (
              <a
                className="rounded-full border border-stone-200 px-3 py-1.5 font-semibold text-stone-600 hover:bg-stone-50"
                href={`tel:${venue.phone}`}
              >
                Call
              </a>
            )}

            <a
              className="rounded-full border border-stone-200 px-3 py-1.5 font-semibold text-stone-600 hover:bg-stone-50"
              href={makeGoogleMapUrl(venue)}
              target="_blank"
              rel="noreferrer"
            >
              Map
            </a>

            <a
              className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-100"
              href={SMARTPLAY_URL}
              target="_blank"
              rel="noreferrer"
            >
              Book
            </a>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-stone-200 px-3 py-1.5 font-semibold text-stone-500 hover:bg-stone-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AvailabilityTable({
  gridRows,
  visibleHours,
  activeSport,
  selectedDate,
  status,
  language = "en",
}) {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [hoveredVenueId, setHoveredVenueId] = useState(null);
  const [hoveredHour, setHoveredHour] = useState(null);

  const copy = SPORT_TABLE_COPY[activeSport] || SPORT_TABLE_COPY.tennis;
  const currentHour = getCurrentHourHK(selectedDate);

  const venueColumnWidth = 220;
  const timeColumnWidth = 42;
  const tableMinWidth = Math.max(720, venueColumnWidth + visibleHours.length * timeColumnWidth);

  return (
    <>
      <div
        className="hidden overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm md:block"
        onMouseLeave={() => {
          setHoveredVenueId(null);
          setHoveredHour(null);
        }}
      >
        <table
          className="w-full table-fixed border-collapse text-left text-xs"
          style={{ minWidth: `${tableMinWidth}px` }}
        >
          <colgroup>
            <col style={{ width: `${venueColumnWidth}px` }} />
            {visibleHours.map((hour) => (
              <col key={hour} style={{ width: `${timeColumnWidth}px` }} />
            ))}
          </colgroup>

          <thead className="sticky top-0 z-30 bg-stone-100 text-[10px] uppercase tracking-wide text-stone-500">
            <tr>
              <th className="sticky left-0 z-40 bg-stone-100 px-2.5 py-2 font-semibold">
                {copy.venueLabel}
              </th>

              {visibleHours.map((hour) => (
                <th
                  key={hour}
                  onMouseEnter={() => setHoveredHour(hour)}
                  className={`px-1 py-2 text-center font-semibold transition ${getHeaderHourClass(
                    hour,
                    hoveredHour,
                    currentHour
                  )}`}
                >
                  <span className="block">{String(hour).padStart(2, "0")}</span>
                  <span className="block text-[8px] font-normal normal-case text-stone-500">
                    {String(hour + 1).padStart(2, "0")}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {gridRows.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-8 text-center text-stone-500"
                  colSpan={visibleHours.length + 1}
                >
                  {status === "loading" ? "Loading live availability..." : copy.noResult}
                </td>
              </tr>
            ) : (
              gridRows.map((venue) => {
                const selected = selectedVenue?.id === venue.id;
                const hovered = hoveredVenueId === venue.id;

                return (
                  <tr
                    key={venue.id}
                    onMouseEnter={() => setHoveredVenueId(venue.id)}
                    className={`border-t border-stone-100 align-middle transition ${
                      selected
                        ? "bg-emerald-50/50"
                        : hovered
                        ? "bg-stone-100/70"
                        : "hover:bg-stone-50"
                    }`}
                  >
                    <td
                      className={`sticky left-0 z-20 cursor-pointer px-2.5 py-1.5 shadow-[2px_0_4px_-3px_rgba(0,0,0,0.35)] transition ${
                        selected
                          ? "bg-emerald-50"
                          : hovered
                          ? "bg-stone-100"
                          : "bg-white"
                      }`}
                      onClick={() => setSelectedVenue(venue)}
                    >
                      <div className="min-w-0">
                        <div className="mb-1 max-w-full truncate rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-semibold text-stone-600">
                          {language === "tc" ? venue.districtTC || venue.districtEN : venue.districtEN}
                          {language === "tc" ? "" : venue.districtTC ? ` · ${venue.districtTC}` : ""}
                        </div>

                        <p
                          className="max-w-[200px] truncate font-semibold leading-tight text-stone-950"
                          title={venue.nameEN}
                        >
                          {venue.nameEN}
                        </p>

                        {venue.nameTC && (
                          <p
                            className="mt-0.5 max-w-[200px] truncate text-[11px] leading-tight text-stone-600"
                            title={venue.nameTC}
                          >
                            {venue.nameTC}
                          </p>
                        )}
                      </div>
                    </td>

                    {venue.hourly.map((cell) => (
                      <td
                        key={cell.hour}
                        onMouseEnter={() => setHoveredHour(cell.hour)}
                        className={`px-1 py-1.5 text-center transition ${getHourColumnClass(
                          cell.hour,
                          hoveredHour,
                          currentHour
                        )}`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedVenue(venue)}
                          className={`mx-auto flex h-[24px] w-[29px] min-w-[29px] items-center justify-center rounded-md px-1.5 text-xs font-bold transition ${getCellClass(
                            cell.availableCourts
                          )}`}
                          title={`${venue.nameEN} · ${cell.label} · ${cell.availableCourts}`}
                        >
                          {cell.availableCourts > 0 ? cell.availableCourts : "—"}
                        </button>
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <VenueDrawer venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
    </>
  );
}










