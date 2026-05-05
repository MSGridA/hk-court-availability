import { SMARTPLAY_URL } from "../config";
import { formatHour } from "../lib/dateTime";
import { makeGoogleMapUrl } from "../lib/maps";
import { getCellClass } from "../lib/availabilityGrid";

const SPORT_TABLE_COPY = {
  tennis: {
    venueLabel: "Tennis venue",
    noResult: "No tennis venues match your filters.",
    totalLabel: "court-hours",
  },
  badminton: {
    venueLabel: "Badminton venue",
    noResult: "No badminton venues match your filters.",
    totalLabel: "court-hours",
  },
  squash: {
    venueLabel: "Squash venue",
    noResult: "No squash venues match your filters, or the live endpoint is unavailable.",
    totalLabel: "court-hours",
  },
};

function GoogleMapLink({ venue }) {
  return (
    <a
      className="font-medium text-emerald-700 hover:text-emerald-900"
      href={makeGoogleMapUrl(venue)}
      target="_blank"
      rel="noreferrer"
    >
      Map
    </a>
  );
}

export default function AvailabilityTable({ gridRows, visibleHours, timeBlock, activeSport }) {
  const copy = SPORT_TABLE_COPY[activeSport] || SPORT_TABLE_COPY.tennis;

  return (
    <div className="hidden overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-sm md:block">
      <table
        className="w-full border-collapse text-left text-sm"
        style={{ minWidth: timeBlock === "fullDay" ? "2050px" : timeBlock === "before2pm" ? "1320px" : "1400px" }}
      >
        <thead className="bg-stone-100 text-xs uppercase tracking-wide text-stone-500">
          <tr>
            <th className="sticky left-0 z-20 w-[380px] bg-stone-100 px-4 py-3 font-semibold">
              {copy.venueLabel}
            </th>

            <th className="w-[80px] px-3 py-3 text-center font-semibold">Courts</th>

            {visibleHours.map((hour) => (
              <th key={hour} className="w-[82px] px-2 py-3 text-center font-semibold">
                <span className="block">{formatHour(hour)}</span>
                <span className="block text-[10px] font-normal normal-case text-stone-400">
                  to {formatHour(hour + 1)}
                </span>
              </th>
            ))}

            <th className="w-[130px] px-3 py-3 text-center font-semibold">Total</th>
            <th className="w-[160px] px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {gridRows.length === 0 ? (
            <tr>
              <td
                className="px-4 py-10 text-center text-stone-500"
                colSpan={visibleHours.length + 4}
              >
                {copy.noResult}
              </td>
            </tr>
          ) : (
            gridRows.map((venue) => (
              <tr
                key={venue.id}
                className="border-t border-stone-100 align-middle hover:bg-stone-50"
              >
                <td className="sticky left-0 z-10 bg-white px-4 py-4 shadow-[1px_0_0_0_rgba(231,229,228,1)]">
                  <div className="mb-2 inline-flex rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-600">
                    {venue.districtEN} {venue.districtTC ? `· ${venue.districtTC}` : ""}
                  </div>

                  <p className="font-semibold text-stone-950">{venue.nameEN}</p>

                  {venue.nameTC && (
                    <p className="mt-1 text-stone-700">{venue.nameTC}</p>
                  )}

                  <div className="mt-2 space-y-1 text-xs leading-5 text-stone-500">
                    <p>{venue.addressEN || "Address not provided"}</p>
                    {venue.addressTC && <p>{venue.addressTC}</p>}
                  </div>
                </td>

                <td className="px-3 py-4 text-center font-semibold text-stone-700">
                  {venue.courts}
                </td>

                {venue.hourly.map((cell) => (
                  <td key={cell.hour} className="px-2 py-3 text-center">
                    <div
                      className={`mx-auto flex h-10 w-12 items-center justify-center rounded-xl border text-base font-semibold ${getCellClass(
                        cell.availableCourts
                      )}`}
                      title={`${venue.nameEN} · ${cell.label} · ${cell.availableCourts} available court(s)`}
                    >
                      {cell.availableCourts > 0 ? cell.availableCourts : "—"}
                    </div>
                  </td>
                ))}

                <td className="px-3 py-4 text-center">
                  <p className="font-semibold text-stone-950">
                    {venue.totalAvailableCourtHours}
                  </p>
                  <p className="text-xs text-stone-500">{copy.totalLabel}</p>
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-end gap-3 whitespace-nowrap">
                    {venue.phone && (
                      <a
                        className="font-medium text-emerald-700 hover:text-emerald-900"
                        href={`tel:${venue.phone}`}
                      >
                        Call
                      </a>
                    )}

                    <GoogleMapLink venue={venue} />

                    <a
                      className="font-medium text-emerald-700 hover:text-emerald-900"
                      href={SMARTPLAY_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Book
                    </a>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}




