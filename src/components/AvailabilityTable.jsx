import { useState } from "react";
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
    return "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200 hover:bg-emerald-200";
  }

  return "bg-stone-50 text-stone-300 ring-1 ring-stone-100";
}

function getAvailableSlots(venue) {
  return venue.hourly.filter((cell) => cell.availableCourts > 0);
}

function VenueDrawer({ venue, onClose }) {
  if (!venue) return null;

  const availableSlots = getAvailableSlots(venue);

  return (
    <div className="fixed bottom-4 left-1/2 z-50 hidden w-[min(920px,calc(100vw-32px))] -translate-x-1/2 rounded-3xl border border-stone-200 bg-white p-4 shadow-2xl md:block">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 inline-flex rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-semibold text-stone-600">
            {venue.districtEN}
            {venue.districtTC ? ` · ${venue.districtTC}` : ""}
          </div>

          <p className="font-semibold text-stone-950">{venue.nameEN}</p>
          {venue.nameTC && <p className="mt-0.5 text-xs text-stone-600">{venue.nameTC}</p>}

          <p className="mt-1 text-xs text-stone-500">
            {venue.addressEN || "Address not provided"}
            {venue.addressTC ? ` · ${venue.addressTC}` : ""}
          </p>

          <p className="mt-2 text-xs text-stone-500">
            Available:{" "}
            {availableSlots.length > 0
              ? availableSlots.map((cell) => `${cell.label} (${cell.availableCourts})`).join(" · ")
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
  );
}

export default function AvailabilityTable({ gridRows, visibleHours, activeSport }) {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const copy = SPORT_TABLE_COPY[activeSport] || SPORT_TABLE_COPY.tennis;

  const venueColumnWidth = 220;
  const timeColumnWidth = 42;
  const tableMinWidth = Math.max(720, venueColumnWidth + visibleHours.length * timeColumnWidth);

  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
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
                <th key={hour} className="px-1 py-2 text-center font-semibold">
                  <span className="block">{String(hour).padStart(2, "0")}</span>
                  <span className="block text-[8px] font-normal normal-case text-stone-400">
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
                  {copy.noResult}
                </td>
              </tr>
            ) : (
              gridRows.map((venue) => {
                const selected = selectedVenue?.id === venue.id;

                return (
                  <tr
                    key={venue.id}
                    className={`border-t border-stone-100 align-middle hover:bg-stone-50 ${
                      selected ? "bg-emerald-50/40" : ""
                    }`}
                  >
                    <td
                      className="sticky left-0 z-20 cursor-pointer bg-white px-2.5 py-1.5 shadow-[1px_0_0_0_rgba(231,229,228,1)]"
                      onClick={() => setSelectedVenue(venue)}
                    >
                      <div className="min-w-0">
                        <div className="mb-1 max-w-full truncate rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-semibold text-stone-600">
                          {venue.districtEN}
                          {venue.districtTC ? ` · ${venue.districtTC}` : ""}
                        </div>

                        <p className="max-w-[200px] truncate font-semibold leading-tight text-stone-950">
                          {venue.nameEN}
                        </p>

                        {venue.nameTC && (
                          <p className="mt-0.5 max-w-[200px] truncate text-[11px] leading-tight text-stone-600">
                            {venue.nameTC}
                          </p>
                        )}
                      </div>
                    </td>

                    {venue.hourly.map((cell) => (
                      <td key={cell.hour} className="px-1 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedVenue(venue)}
                          className={`mx-auto flex h-7 w-8 items-center justify-center rounded-lg text-xs font-bold transition ${getCellClass(
                            cell.availableCourts
                          )}`}
                          title={`${venue.nameEN} · ${cell.label} · ${cell.availableCourts}`}
                        >
                          {cell.availableCourts > 0 ? cell.availableCourts : 0}
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
