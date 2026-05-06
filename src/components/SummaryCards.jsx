const SPORTS = [
  {
    id: "tennis",
    mobileTitle: "Tennis",
    title: "Tennis Courts",
    titleTC: "網球場",
    description: "LCSD tennis availability",
  },
  {
    id: "badminton",
    mobileTitle: "Badminton",
    title: "Badminton Courts",
    titleTC: "羽毛球場",
    description: "LCSD badminton availability",
  },
  {
    id: "squash",
    mobileTitle: "Squash",
    title: "Squash Courts",
    titleTC: "壁球場",
    description: "Test availability",
  },
];

export default function SummaryCards({ activeSport, setActiveSport, variant = "default" }) {
  const isHero = variant === "hero";

  return (
    <div
      className={
        isHero
          ? "grid w-[460px] grid-cols-3 gap-2 xl:w-[540px]"
          : "mb-5 grid grid-cols-3 gap-2 md:gap-3"
      }
    >
      {SPORTS.map((sport) => {
        const active = activeSport === sport.id;

        return (
          <button
            key={sport.id}
            type="button"
            onClick={() => setActiveSport(sport.id)}
            className={`rounded-2xl border text-left shadow-sm transition ${
              isHero ? "p-3" : "p-2 md:p-5"
            } ${
              active
                ? "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-100"
                : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
            }`}
          >
            <div className="flex items-start justify-between gap-1.5 md:gap-3">
              <div className="min-w-0 flex-1">
                <p
                  className={
                    isHero
                      ? "truncate text-sm font-semibold leading-tight text-stone-950 xl:text-base"
                      : "truncate text-[11px] font-semibold leading-tight text-stone-950 sm:text-sm md:text-lg"
                  }
                >
                  {isHero ? (
                    sport.mobileTitle
                  ) : (
                    <>
                      <span className="md:hidden">{sport.mobileTitle}</span>
                      <span className="hidden md:inline">{sport.title}</span>
                    </>
                  )}
                </p>

                <p
                  className={
                    isHero
                      ? "mt-1 truncate text-xs text-stone-600"
                      : "mt-0.5 truncate text-[10px] text-stone-600 md:mt-1 md:text-sm"
                  }
                >
                  {sport.titleTC}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full font-semibold ${
                  isHero
                    ? "px-2 py-0.5 text-[10px]"
                    : "px-1.5 py-0.5 text-[9px] md:px-3 md:py-1 md:text-xs"
                } ${active ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600"}`}
              >
                {active ? "Active" : "Open"}
              </span>
            </div>

            {!isHero && (
              <p className="mt-3 hidden text-sm text-stone-500 md:block">
                {sport.description}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}


