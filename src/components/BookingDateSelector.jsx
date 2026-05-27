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
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return getShortWeekday(date);
}

export default function BookingDateSelector({
  availableDates,
  selectedDate,
  setSelectedDate,
}) {
  return (
    <div className="mt-0 mb-2 bg-transparent p-0 shadow-none sm:mt-0 sm:rounded-2xl sm:border sm:border-stone-200 sm:bg-white sm:p-3 sm:shadow-sm">
      <div className="mb-1.5 hidden items-center justify-between sm:flex">
        <p className="text-xs font-semibold text-stone-700 sm:text-sm">
          Booking Date
        </p>
      </div>

      <div className="grid w-full grid-cols-7 gap-1.5">
        {availableDates.map((date, index) => {
          const active = selectedDate === date;

          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`flex min-w-0 flex-col items-center justify-center rounded-xl border px-0.5 py-1.5 text-center shadow-sm transition sm:px-2 sm:py-2 ${
                active
                  ? "border-emerald-300 bg-emerald-50 ring-1 ring-emerald-100"
                  : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <p
                className={`w-full text-center text-[9px] font-semibold uppercase leading-none tracking-normal sm:text-[10px] sm:tracking-wide ${
                  active ? "text-emerald-700" : "text-stone-400"
                }`}
              >
                <span className="sm:hidden">
                  {getMobileDateLabel(index, date)}
                </span>
                <span className="hidden sm:inline">
                  {getDesktopDateLabel(index, date)}
                </span>
              </p>

              <p className="mt-1 text-center text-[clamp(15px,3.8vw,16px)] font-semibold leading-none text-stone-950 sm:text-[clamp(21px,1.8vw,23px)]">
                {getMonthDay(date)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}












