export default function TimeBlockSwitch({ timeBlock, setTimeBlock }) {
  const buttonClass = (value) =>
    `h-9 rounded-xl px-2 text-xs font-semibold transition ${
      timeBlock === value
        ? "bg-stone-950 text-white shadow-sm"
        : "bg-white text-stone-500 ring-1 ring-stone-200 hover:bg-stone-50 hover:text-stone-900"
    }`;

  return (
    <div className="grid w-full grid-cols-4 gap-2">
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
