import { useState } from "react";
import { SMARTPLAY_URL } from "../config";
import { makeGoogleMapUrl } from "../lib/maps";

const SPORT_COPY = {
  tennis: {
    empty: "No tennis venues match your filters.",
  },
  badminton: {
    empty: "No badminton venues match your filters.",
  },
  squash: {
    empty: "No squash venues match your filters, or the live endpoint is unavailable.",
  },
};

function getCellClass(count) {
  if (count > 0) {
    return "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200";
  }

  return "bg-stone-50 text-stone-300 ring-1 ring-stone-100";
}

function getAvailableSlots(venue) {
  return venue.hourly.filter((cell) => cell.availableCourts > 0);
}

function MobileDrawer({ venue, onClose }) {
  if (!venue) return null;

  const availableSlots = getAvailableSlots(venue);

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 rounded-3xl border border-stone-200 bg-white p-4 shadow-2xl md:hidden">
      <div className="mb-2 inline-flex rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-semibold text-stone-500">
        {venue.districtEN}
      </div>

      <p className="font-semibold text-stone-950">{venue.nameEN}</p>
      {venue.nameTC && <p className="mt-0.5 text-xs text-stone-600">{venue.nameTC}</p>}

      <p className="mt-2 text-xs text-stone-500">
        Available:{" "}
        {availableSlots.length > 0
          ? availableSlots.map((cell) => `${cell.label} (${cell.availableCourts})`).join(" · ")
          : "No available court shown."}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600"
          href={makeGoogleMapUrl(venue)}
          target="_blank"
          rel="noreferrer"
        >
          Map
        </a>

        <a
          className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
          href={SMARTPLAY_URL}
          target="_blank"
          rel="noreferrer"
        >
          Book
        </a>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function MobileAvailabilityList({ gridRows, activeSport }) {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const copy = SPORT_COPY[activeSport] || SPORT_COPY.tennis;

  if (gridRows.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm md:hidden">
        <p className="text-sm font-medium text-stone-500">{copy.empty}</p>
      </div>
    );
  }

  const firstVenue = gridRows[0];
  const visibleHours = firstVenue?.hourly?.map((cell) => cell.hour) || [];
  const venueColumnWidth = 150;
  const timeColumnWidth = 36;
  const tableMinWidth = Math.max(560, venueColumnWidth + visibleHours.length * timeColumnWidth);

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm md:hidden">
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

          <thead className="bg-stone-100 text-[9px] uppercase tracking-wide text-stone-500">
            <tr>
              <th className="sticky left-0 z-30 bg-stone-100 px-2 py-2 font-semibold">
                Venue
              </th>

              {visibleHours.map((hour) => (
                <th key={hour} className="px-1 py-2 text-center font-semibold">
                  {String(hour).padStart(2, "0")}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {gridRows.map((venue) => {
              const selected = selectedVenue?.id === venue.id;

              return (
                <tr
                  key={venue.id}
                  className={`border-t border-stone-100 ${selected ? "bg-emerald-50/40" : ""}`}
                >
                  <td
                    className="sticky left-0 z-20 cursor-pointer bg-white px-2 py-2 shadow-[1px_0_0_0_rgba(231,229,228,1)]"
                    onClick={() => setSelectedVenue(venue)}
                  >
                    <div className="mb-0.5 max-w-[130px] truncate rounded-full bg-stone-100 px-1.5 py-0.5 text-[8px] font-semibold text-stone-500">
                      {venue.districtEN}
                    </div>

                    <p className="max-w-[130px] truncate text-[11px] font-semibold leading-tight text-stone-950">
                      {venue.nameEN}
                    </p>
                  </td>

                  {venue.hourly.map((cell) => (
                    <td key={cell.hour} className="px-1 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedVenue(venue)}
                        className={`mx-auto flex h-7 w-8 items-center justify-center rounded-lg text-[11px] font-bold ${getCellClass(
                          cell.availableCourts
                        )}`}
                      >
                        {cell.availableCourts > 0 ? cell.availableCourts : 0}
                      </button>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <MobileDrawer venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
    </>
  );
}
