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
    <div className="hidden overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
      <table
        className="w-full border-collapse text-left text-xs"
        style={{ minWidth: timeBlock === "fullDay" ? "1680px" : timeBlock === "before2pm" ? "1120px" : "1180px" }}
      >
        <thead className="bg-stone-100 text-[10px] uppercase tracking-wide text-stone-500">
          <tr>
            <th className="sticky left-0 z-20 w-[310px] bg-stone-100 px-3 py-2 font-semibold">
              {copy.venueLabel}
            </th>

            <th className="w-[58px] px-2 py-2 text-center font-semibold">Courts</th>

            {visibleHours.map((hour) => (
              <th key={hour} className="w-[64px] px-1 py-2 text-center font-semibold">
                <span className="block">{formatHour(hour)}</span>
                <span className="block text-[9px] font-normal normal-case text-stone-400">
                  {formatHour(hour + 1)}
                </span>
              </th>
            ))}

            <th className="w-[76px] px-2 py-2 text-center font-semibold">Total</th>
            <th className="w-[100px] px-3 py-2 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {gridRows.length === 0 ? (
            <tr>
              <td
                className="px-4 py-8 text-center text-stone-500"
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
                <td className="sticky left-0 z-10 bg-white px-3 py-2 shadow-[1px_0_0_0_rgba(231,229,228,1)]">
                  <div className="mb-1 inline-flex rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
                    {venue.districtEN} {venue.districtTC ? `· ${venue.districtTC}` : ""}
                  </div>

                  <p className="font-semibold leading-tight text-stone-950">{venue.nameEN}</p>

                  {venue.nameTC && (
                    <p className="mt-0.5 leading-tight text-stone-700">{venue.nameTC}</p>
                  )}

                  <div className="mt-1 space-y-0.5 text-[10px] leading-4 text-stone-500">
                    <p>{venue.addressEN || "Address not provided"}</p>
                    {venue.addressTC && <p>{venue.addressTC}</p>}
                  </div>
                </td>

                <td className="px-2 py-2 text-center font-semibold text-stone-700">
                  {venue.courts}
                </td>

                {venue.hourly.map((cell) => (
                  <td key={cell.hour} className="px-1 py-2 text-center">
                    <div
                      className={`mx-auto flex h-8 w-10 items-center justify-center rounded-lg border text-sm font-semibold ${getCellClass(
                        cell.availableCourts
                      )}`}
                      title={`${venue.nameEN} · ${cell.label} · ${cell.availableCourts} available court(s)`}
                    >
                      {cell.availableCourts > 0 ? cell.availableCourts : "—"}
                    </div>
                  </td>
                ))}

                <td className="px-2 py-2 text-center">
                  <p className="font-semibold text-stone-950">
                    {venue.totalAvailableCourtHours}
                  </p>
                  <p className="text-[10px] text-stone-500">{copy.totalLabel}</p>
                </td>

                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2 whitespace-nowrap">
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
