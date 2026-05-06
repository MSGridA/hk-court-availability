export default function TimeBlockSwitch({ timeBlock, setTimeBlock }) {
  const buttonClass = (value) =>
    `h-11 rounded-xl px-3 text-sm font-semibold transition ${
      timeBlock === value
        ? "bg-white text-stone-950 shadow-sm"
        : "text-stone-500 hover:text-stone-800"
    }`;

  return (
    <div className="grid w-[330px] shrink-0 grid-cols-3 rounded-2xl border border-stone-200 bg-stone-100 p-1 shadow-sm">
      <button
        className={buttonClass("fullDay")}
        onClick={() => setTimeBlock("fullDay")}
        type="button"
      >
        Full Day
      </button>

      <button
        className={buttonClass("before2pm")}
        onClick={() => setTimeBlock("before2pm")}
        type="button"
      >
        Before 2pm
      </button>

      <button
        className={buttonClass("after2pm")}
        onClick={() => setTimeBlock("after2pm")}
        type="button"
      >
        After 2pm
      </button>
    </div>
  );
}
