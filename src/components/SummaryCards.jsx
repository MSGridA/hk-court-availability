const SPORTS = [
  {
    id: "tennis",
    name: "Tennis",
    nameTC: "網球",
    description: "Court availability",
    descriptionTC: "場地空位",
  },
  {
    id: "badminton",
    name: "Badminton",
    nameTC: "羽毛球",
    description: "Court availability",
    descriptionTC: "場地空位",
  },
  {
    id: "squash",
    name: "Squash",
    nameTC: "壁球",
    description: "Court availability",
    descriptionTC: "場地空位",
  },
];

export default function SummaryCards({
  activeSport,
  setActiveSport,
  variant = "default",
  language = "en",
}) {
  const isHero = variant === "hero";
  const isTC = language === "tc";

  return (
    <div
      className={
        isHero
          ? "grid w-[360px] grid-cols-3 gap-2"
          : "mb-0 grid grid-cols-3 gap-2 md:mb-5 md:gap-3"
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
                ? "border-emerald-300 bg-emerald-50 ring-1 ring-emerald-100"
                : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[11px] font-semibold leading-tight text-stone-950 sm:text-sm md:text-lg">
                {isTC ? sport.nameTC : sport.name}
              </p>

              {active && (
                <span className="hidden rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white sm:inline-flex">
                  {isTC ? "使用中" : "Active"}
                </span>
              )}
            </div>

            <p className="mt-0.5 truncate text-[10px] text-stone-600 md:mt-1 md:text-sm">
              {isTC ? sport.descriptionTC : sport.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
