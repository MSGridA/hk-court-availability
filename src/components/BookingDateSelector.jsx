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
  if (index === 0) return "TDY";
  if (index === 1) return "TMR";
  return getShortWeekday(date);
}

function getDesktopDateLabel(index, date) {
  if (index === 0) return "TDY";
  if (index === 1) return "Tomorrow";
  return getShortWeekday(date);
}

export default function BookingDateSelector({ availableDates, selectedDate, setSelectedDate }) {
  return (
    <div className="mb-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-stone-700">Booking Date</p>
      </div>

      <div className="grid grid-cols-7 gap-1.5 md:gap-2">
        {availableDates.map((date, index) => {
          const active = selectedDate === date;

          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`flex min-w-0 flex-col items-center justify-center rounded-xl border px-1 py-2 text-center transition md:px-2 ${
                active
                  ? "border-emerald-300 bg-emerald-50 ring-1 ring-emerald-100"
                  : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <p
                className={`w-full text-center text-[9px] font-semibold uppercase tracking-normal leading-none md:text-[10px] md:tracking-wide ${
                  active ? "text-emerald-700" : "text-stone-400"
                }`}
              >
                <span className="md:hidden">{getMobileDateLabel(index, date)}</span>
                <span className="hidden md:inline">{getDesktopDateLabel(index, date)}</span>
              </p>

              <p className="mt-1 text-center text-sm font-semibold leading-none text-stone-950 md:text-lg">
                {getMonthDay(date)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}


