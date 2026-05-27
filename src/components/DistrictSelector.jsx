import { DISTRICT_GROUPS } from "../data/districts";

function isSelected(selectedDistricts, value) {
  return selectedDistricts.includes(value);
}

function isGroupSelected(selectedDistricts, group) {
  if (selectedDistricts.length === 0) return false;
  return group.districts.every((district) => selectedDistricts.includes(district.value));
}

function getLabel(item, language) {
  if (language === "tc") return item.labelTC || item.label;
  return item.label || item.labelTC;
}

export default function DistrictSelector({
  selectedDistricts,
  setSelectedDistricts,
  language = "en",
}) {
  const allSelected = selectedDistricts.length === 0;

  function selectAll() {
    setSelectedDistricts([]);
  }

  function toggleDistrict(value) {
    if (allSelected) {
      setSelectedDistricts([value]);
      return;
    }

    if (selectedDistricts.includes(value)) {
      const next = selectedDistricts.filter((item) => item !== value);
      setSelectedDistricts(next.length === 0 ? [] : next);
      return;
    }

    setSelectedDistricts([...selectedDistricts, value]);
  }

  function toggleGroup(group) {
    const groupValues = group.districts.map((district) => district.value);
    const groupAlreadySelected = groupValues.every((value) => selectedDistricts.includes(value));

    if (allSelected) {
      setSelectedDistricts(groupValues);
      return;
    }

    if (groupAlreadySelected) {
      const next = selectedDistricts.filter((value) => !groupValues.includes(value));
      setSelectedDistricts(next.length === 0 ? [] : next);
      return;
    }

    setSelectedDistricts(Array.from(new Set([...selectedDistricts, ...groupValues])));
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={selectAll}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            allSelected
              ? "border-emerald-300 bg-emerald-600 text-white"
              : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          }`}
        >
          {language === "tc" ? "全部地區" : "All districts"}
        </button>

        {DISTRICT_GROUPS.map((group) => {
          const active = isGroupSelected(selectedDistricts, group);

          return (
            <button
              key={group.id}
              type="button"
              onClick={() => toggleGroup(group)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "border-emerald-300 bg-emerald-600 text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              }`}
            >
              {getLabel(group, language)}
            </button>
          );
        })}
      </div>

      <div className="grid gap-2 lg:grid-cols-3">
        {DISTRICT_GROUPS.map((group) => (
          <div key={group.id} className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-stone-400">
              {getLabel(group, language)}
            </p>

            <div className="flex flex-wrap gap-2">
              {group.districts.map((district) => {
                const active = isSelected(selectedDistricts, district.value);

                return (
                  <button
                    key={district.value}
                    type="button"
                    onClick={() => toggleDistrict(district.value)}
                    className={`rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition ${
                      active
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                        : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {getLabel(district, language)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
