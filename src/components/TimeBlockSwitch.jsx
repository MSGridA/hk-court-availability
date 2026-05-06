export default function TimeBlockSwitch({ timeBlock, setTimeBlock }) {
  const buttonClass = (value) =>
    `h-9 rounded-xl px-2 text-xs font-semibold transition ${
      timeBlock === value
        ? "bg-white text-stone-950 shadow-sm"
        : "text-stone-500 hover:text-stone-800"
    }`;

  return (
    <div className="grid w-full max-w-[420px] shrink-0 grid-cols-4 rounded-2xl border border-stone-200 bg-stone-100 p-1 shadow-sm">
      <button
        className={buttonClass("fullDay")}
        onClick={() => setTimeBlock("fullDay")}
        type="button"
      >
        Full
      </button>

      <button
        className={buttonClass("before12")}
        onClick={() => setTimeBlock("before12")}
        type="button"
      >
        Before 12
      </button>

      <button
        className={buttonClass("midday")}
        onClick={() => setTimeBlock("midday")}
        type="button"
      >
        12–6
      </button>

      <button
        className={buttonClass("after6pm")}
        onClick={() => setTimeBlock("after6pm")}
        type="button"
      >
        After 6
      </button>
    </div>
  );
}
