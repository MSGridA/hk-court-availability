import { normalizeKey } from "./normalize";
import { formatHourRange, timeToMinutes } from "./dateTime";

export function getCellClass(count) {
  if (count >= 5) return "bg-emerald-200 text-emerald-950 border-emerald-300";
  if (count >= 3) return "bg-emerald-100 text-emerald-900 border-emerald-200";
  if (count > 0) return "bg-emerald-50 text-emerald-800 border-emerald-200";
  return "bg-stone-50 text-stone-300 border-stone-100";
}

export function buildVenueGrid(venues, availability, selectedDate, visibleHours) {
  const venueMap = new Map();

  for (const venue of venues) {
    const keys = [normalizeKey(venue.nameEN), normalizeKey(venue.nameTC)].filter(Boolean);

    venueMap.set(venue.id, {
      ...venue,
      keys,
      matchedSlots: [],
    });
  }

  for (const slot of availability) {
    const slotKeys = [normalizeKey(slot.venueEN), normalizeKey(slot.venueTC)].filter(Boolean);

    const matchedVenue = Array.from(venueMap.values()).find((venue) =>
      venue.keys.some((venueKey) =>
        slotKeys.some(
          (slotKey) =>
            venueKey === slotKey ||
            venueKey.includes(slotKey) ||
            slotKey.includes(venueKey)
        )
      )
    );

    if (matchedVenue) {
      matchedVenue.matchedSlots.push(slot);
    }
  }

  return Array.from(venueMap.values())
    .map((venue) => {
      const dateSlots = venue.matchedSlots.filter(
        (slot) => slot.date === selectedDate && slot.availableCourts > 0
      );

      const hourly = visibleHours.map((hour) => {
        const hourStart = hour * 60;
        const hourEnd = (hour + 1) * 60;

        const matchingSlots = dateSlots.filter((slot) => {
          const slotStart = timeToMinutes(slot.start);
          const slotEnd = timeToMinutes(slot.end);
          return slotStart < hourEnd && slotEnd > hourStart;
        });

        const availableCourts = matchingSlots.reduce(
          (sum, slot) => sum + slot.availableCourts,
          0
        );

        const hasApproximateCount = matchingSlots.some(
          (slot) => slot.countIsExact === false || slot.countType === "binary"
        );

        const displayCourts =
          availableCourts > 0 && hasApproximateCount
            ? "≥1"
            : availableCourts > 0
            ? String(availableCourts)
            : "—";

        return {
          hour,
          label: formatHourRange(hour),
          availableCourts,
          displayCourts,
          hasApproximateCount,
          matchingSlots,
        };
      });

      const totalAvailableHours = hourly.filter((cell) => cell.availableCourts > 0).length;
      const totalAvailableCourtHours = hourly.reduce(
        (sum, cell) => sum + cell.availableCourts,
        0
      );
      const firstAvailableCell = hourly.find((cell) => cell.availableCourts > 0) || null;

      return {
        ...venue,
        hourly,
        totalAvailableHours,
        totalAvailableCourtHours,
        firstAvailableCell,
      };
    })
    .sort((a, b) => {
      if (a.totalAvailableCourtHours !== b.totalAvailableCourtHours) {
        return b.totalAvailableCourtHours - a.totalAvailableCourtHours;
      }

      return a.districtEN.localeCompare(b.districtEN) || a.nameEN.localeCompare(b.nameEN);
    });
}
