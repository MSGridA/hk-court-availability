function getDateParts(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function getShortWeekday(dateString) {
  const date = getDateParts(dateString);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC",
  }).format(date);
}

function getMonthDay(dateString) {
  const [, month, day] = dateString.split("-");
  return `${month}/${day}`;
}

function getMobileDateLabel(index, date) {
  if (index === 0) return "Today";
  if (index === 1) return "Tmr";
  return getShortWeekday(date);
}

function getDesktopDateLabel(index, date) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return getShortWeekday(date);
}

export default function BookingDateSelector({ availableDates, selectedDate, setSelectedDate }) {
  return (
    <div className="mb-5 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3">
        <p className="text-sm font-medium text-stone-600">Booking Date</p>
      </div>

      <div className="grid grid-cols-7 gap-1.5 md:gap-2">
        {availableDates.map((date, index) => {
          const active = selectedDate === date;

          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`min-w-0 rounded-2xl border px-1.5 py-2 text-left transition md:px-3 md:py-3 ${
                active
                  ? "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-100"
                  : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <p
                className={`truncate text-[9px] font-semibold uppercase tracking-wide md:text-[11px] ${
                  active ? "text-emerald-700" : "text-stone-400"
                }`}
              >
                <span className="md:hidden">{getMobileDateLabel(index, date)}</span>
                <span className="hidden md:inline">{getDesktopDateLabel(index, date)}</span>
              </p>

              <p className="mt-1 text-base font-semibold leading-none text-stone-950 md:text-2xl">
                {getMonthDay(date)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

