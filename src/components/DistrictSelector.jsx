import { useState } from "react";
import { DISTRICT_GROUPS } from "../data/districts";

function isSelected(selectedDistricts, value) {
  return selectedDistricts.includes(value);
}

function isGroupSelected(selectedDistricts, group) {
  if (selectedDistricts.length === 0) return false;
  return group.districts.every((district) => selectedDistricts.includes(district.value));
}

function getDistrictSummary(selectedDistricts) {
  if (selectedDistricts.length === 0) return "All districts";
  if (selectedDistricts.length === 1) return selectedDistricts[0];
  return `${selectedDistricts.length} districts selected`;
}

export default function DistrictSelector({ selectedDistricts, setSelectedDistricts }) {
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-stone-700">Districts</p>
          <p className="mt-1 text-xs text-stone-500">
            {getDistrictSummary(selectedDistricts)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 md:hidden"
        >
          {mobileOpen ? "Hide districts" : "Choose districts"}
        </button>
      </div>

      <div className={`${mobileOpen ? "block" : "hidden"} mt-4 md:block`}>
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={selectAll}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              allSelected
                ? "border-emerald-300 bg-emerald-600 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-100"
            }`}
          >
            All districts
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
                    : "border-stone-200 bg-white text-stone-600 hover:bg-stone-100"
                }`}
              >
                {group.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {DISTRICT_GROUPS.map((group) => (
            <div key={group.id} className="rounded-2xl border border-stone-200 bg-white p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                {group.label} · {group.labelTC}
              </p>

              <div className="flex flex-wrap gap-2">
                {group.districts.map((district) => {
                  const active = isSelected(selectedDistricts, district.value);

                  return (
                    <button
                      key={district.value}
                      type="button"
                      onClick={() => toggleDistrict(district.value)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                          : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {district.label} · {district.labelTC}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
