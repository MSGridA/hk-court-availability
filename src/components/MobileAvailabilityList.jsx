import { makeGoogleMapUrl } from "../lib/maps";

const SPORT_COPY = {
  tennis: {
    venueLabel: "Tennis venue",
    empty: "No tennis venues match your filters.",
  },
  badminton: {
    venueLabel: "Badminton venue",
    empty: "No badminton venues match your filters.",
  },
  squash: {
    venueLabel: "Squash venue",
    empty: "No squash venues match your filters, or the live endpoint is unavailable.",
  },
};

function getSlotClass(count) {
  if (count > 0) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  return "border-stone-200 bg-stone-50 text-stone-400";
}

export default function MobileAvailabilityList({ gridRows, activeSport, availableOnly }) {
  const copy = SPORT_COPY[activeSport] || SPORT_COPY.tennis;

  if (gridRows.length === 0) {
    return (
      <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm md:hidden">
        <p className="text-sm font-medium text-stone-500">{copy.empty}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:hidden">
      {gridRows.map((venue) => {
        const visibleCells = availableOnly
          ? venue.hourly.filter((cell) => cell.availableCourts > 0)
          : venue.hourly;

        return (
          <article
            key={venue.id}
            className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-2 inline-flex rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-600">
                  {venue.districtEN} {venue.districtTC ? `· ${venue.districtTC}` : ""}
                </div>

                <h2 className="text-base font-semibold leading-snug text-stone-950">
                  {venue.nameEN}
                </h2>

                {venue.nameTC && (
                  <p className="mt-1 text-sm leading-snug text-stone-700">
                    {venue.nameTC}
                  </p>
                )}
              </div>

              <div className="w-[148px] shrink-0">
                <div className="flex justify-end">
                  <a
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                    href={makeGoogleMapUrl(venue)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Map
                  </a>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-stone-200 bg-stone-50 px-2 py-1.5 text-center">
                    <p className="text-[9px] font-semibold uppercase tracking-wide text-stone-400">
                      Courts
                    </p>
                    <p className="mt-0.5 text-sm font-semibold leading-none text-stone-950">
                      {venue.courts}
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-center">
                    <p className="text-[9px] font-semibold uppercase tracking-wide text-emerald-600">
                      Free
                    </p>
                    <p className="mt-0.5 text-sm font-semibold leading-none text-emerald-800">
                      {venue.totalAvailableCourtHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>



            <div className="mt-3">
              <p className="mb-2 text-xs font-medium text-stone-500">
                {availableOnly ? "Available time slots" : "Time slots"}
              </p>

              {visibleCells.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {visibleCells.map((cell) => (
                    <div
                      key={cell.hour}
                      className={`rounded-2xl border px-3 py-2 text-xs font-semibold ${getSlotClass(
                        cell.availableCourts
                      )}`}
                      title={`${venue.nameEN} · ${cell.label} · ${cell.availableCourts} available court(s)`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{cell.label}</span>
                        <span>{cell.availableCourts > 0 ? cell.availableCourts : "—"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-stone-100 bg-stone-50 px-3 py-2 text-sm text-stone-500">
                  No available court shown in this time block.
                </p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

