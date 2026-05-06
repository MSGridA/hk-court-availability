import { useEffect, useRef, useState } from "react";
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
    return "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300";
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

function getHourColumnClass(hour, currentHour) {
  if (currentHour === hour) return "bg-amber-100/80 ring-1 ring-amber-200";
  return hour % 2 === 0 ? "bg-stone-200/70" : "bg-white";
}

function getHeaderHourClass(hour, currentHour) {
  if (currentHour === hour) return "bg-amber-200/80 text-amber-900 ring-1 ring-amber-300";
  return hour % 2 === 0 ? "bg-stone-300/60" : "";
}

function getAvailableSlots(venue) {
  return venue.hourly.filter((cell) => cell.availableCourts > 0);
}

function MobileDrawer({ venue, onClose }) {
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
        className="fixed inset-0 z-40 cursor-default bg-transparent md:hidden"
        aria-label="Close venue details"
        onClick={onClose}
      />

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
    </>
  );
}

export default function MobileAvailabilityList({ gridRows, activeSport, selectedDate }) {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const gridScrollRef = useRef(null);

  const copy = SPORT_COPY[activeSport] || SPORT_COPY.tennis;
  const currentHour = getCurrentHourHK(selectedDate);

  const firstVenue = gridRows[0];
  const visibleHours = firstVenue?.hourly?.map((cell) => cell.hour) || [];
  const visibleHourKey = visibleHours.join(",");

  const venueColumnWidth = 150;
  const timeColumnWidth = 36;
  const tableMinWidth = venueColumnWidth + visibleHours.length * timeColumnWidth;

  useEffect(() => {
    if (!gridScrollRef.current || currentHour === null) return;

    const hourIndex = visibleHours.indexOf(currentHour);
    if (hourIndex < 0) return;

    const targetLeft = Math.max(0, venueColumnWidth + hourIndex * timeColumnWidth - 96);

    window.requestAnimationFrame(() => {
      gridScrollRef.current?.scrollTo({
        left: targetLeft,
        behavior: "smooth",
      });
    });
  }, [currentHour, selectedDate, visibleHourKey]);

  if (gridRows.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm md:hidden">
        <p className="text-sm font-medium text-stone-500">{copy.empty}</p>
      </div>
    );
  }

  return (
    <>
      <div
        ref={gridScrollRef}
        className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm md:hidden"
      >
        <table
          className="table-fixed border-collapse text-left text-xs"
          style={{ minWidth: `${tableMinWidth}px` }}
        >
          <colgroup>
            <col style={{ width: `${venueColumnWidth}px` }} />
            {visibleHours.map((hour) => (
              <col key={hour} style={{ width: `${timeColumnWidth}px` }} />
            ))}
          </colgroup>

          <thead className="sticky top-0 z-30 bg-stone-100 text-[9px] uppercase tracking-wide text-stone-500">
            <tr>
              <th className="sticky left-0 z-40 bg-stone-100 px-2 py-2 font-semibold shadow-[1px_0_0_0_rgba(214,211,209,1)]">
                Venue
              </th>

              {visibleHours.map((hour) => (
                <th
                  key={hour}
                  className={`px-1 py-2 text-center font-semibold ${getHeaderHourClass(
                    hour,
                    currentHour
                  )}`}
                >
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
                    className="sticky left-0 z-20 cursor-pointer bg-white px-2 py-2 shadow-[2px_0_4px_-3px_rgba(0,0,0,0.35)]"
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
                    <td
                      key={cell.hour}
                      className={`px-1 py-2 text-center ${getHourColumnClass(
                        cell.hour,
                        currentHour
                      )}`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedVenue(venue)}
                        className={`mx-auto flex h-[23px] w-[27px] min-w-[27px] items-center justify-center rounded-md px-1.5 text-[11px] font-bold ${getCellClass(
                          cell.availableCourts
                        )}`}
                      >
                        {cell.availableCourts > 0 ? cell.availableCourts : "—"}
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


