import { getNextBookingDatesHK } from "../lib/dateTime";

const GOPARK_TENNIS_FACILITY_ID = "656712a85a07f53af9b5a90a";
const GOPARK_API_BASE = "https://api.goparksports.hk/prod/v1";

const GOPARK_TENNIS_COURTS = [
  { id: "65f904cc05d542661ce2eba4", nameEN: "Tennis Court 1", nameTC: "1號網球場" },
  { id: "664e9980b7828504dfec18d4", nameEN: "Tennis Court 2", nameTC: "2號網球場" },
  { id: "664e998db7828504dfec18e4", nameEN: "Tennis Court 3", nameTC: "3號網球場" },
  { id: "664e9996b7828504dfec18f4", nameEN: "Tennis Court 4", nameTC: "4號網球場" },
  { id: "664e99a3b7828504dfec1904", nameEN: "Tennis Court 5", nameTC: "5號網球場" },
  { id: "664e99adb7828504dfec1914", nameEN: "Tennis Court 6", nameTC: "6號網球場" },
];

function toGoparkApiDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  // HK midnight represented as UTC.
  return new Date(Date.UTC(year, month - 1, day - 1, 16, 0, 0, 0)).toISOString();
}

function formatTimeHK(date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Hong_Kong",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function normalizeTime(value) {
  if (!value) return "";

  const text = String(value).trim();

  // API may return an ISO UTC datetime. Convert that to HK time.
  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
    const parsed = new Date(text);

    if (!Number.isNaN(parsed.getTime())) {
      return formatTimeHK(parsed);
    }
  }

  const rangeMatch = text.match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
  if (rangeMatch) {
    return `${rangeMatch[1].padStart(2, "0")}:${rangeMatch[2]}`;
  }

  const timeMatch = text.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    return `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;
  }

  return text;
}

function getSlotStart(slot) {
  return normalizeTime(
    slot.start_time ||
      slot.startTime ||
      slot.start ||
      slot.from ||
      slot.timeStart ||
      slot.startAt ||
      slot.start_at ||
      slot.startDateTime ||
      slot.start_datetime ||
      slot.time ||
      slot.timeslot ||
      slot.slot
  );
}

function getSlotEnd(slot) {
  const rangeText = slot.time || slot.timeslot || slot.slot || "";
  const rangeMatch = String(rangeText).match(/^\d{1,2}:\d{2}\s*-\s*(\d{1,2}:\d{2})$/);

  return normalizeTime(
    slot.end_time ||
      slot.endTime ||
      slot.end ||
      slot.to ||
      slot.timeEnd ||
      slot.endAt ||
      slot.end_at ||
      slot.endDateTime ||
      slot.end_datetime ||
      (rangeMatch ? rangeMatch[1] : "")
  );
}

function isFalseLike(value) {
  return value === false || value === "false" || value === 0 || value === "0";
}

function isTrueLike(value) {
  return value === true || value === "true" || value === 1 || value === "1";
}

function isSlotAvailable(slot) {
  if (!slot || typeof slot !== "object") return false;

  const remainingQuota = Number(
    slot.remainingQuota ??
      slot.remaining_quota ??
      slot.availableQuota ??
      slot.available_quota ??
      slot.quota
  );

  if (Number.isFinite(remainingQuota)) {
    return remainingQuota > 0;
  }

  if (
    isTrueLike(slot.isUnavailable) ||
    isTrueLike(slot.unavailable) ||
    isTrueLike(slot.isOccupied) ||
    isTrueLike(slot.occupied) ||
    isTrueLike(slot.isBooked) ||
    isTrueLike(slot.booked) ||
    isTrueLike(slot.disabled)
  ) {
    return false;
  }

  if (
    isTrueLike(slot.isAvailable) ||
    isTrueLike(slot.available) ||
    isTrueLike(slot.canBook) ||
    isTrueLike(slot.bookable)
  ) {
    return true;
  }

  if (
    isFalseLike(slot.isAvailable) ||
    isFalseLike(slot.available) ||
    isFalseLike(slot.canBook) ||
    isFalseLike(slot.bookable)
  ) {
    return false;
  }

  const status = String(
    slot.status ||
      slot.bookingStatus ||
      slot.booking_status ||
      slot.availability ||
      ""
  ).toLowerCase();

  if (
    status.includes("unavailable") ||
    status.includes("occupied") ||
    status.includes("booked") ||
    status.includes("reserved") ||
    status.includes("disabled") ||
    status.includes("full")
  ) {
    return false;
  }

  if (
    status.includes("available") ||
    status.includes("vacant") ||
    status.includes("open") ||
    status.includes("bookable")
  ) {
    return true;
  }

  // If the per-court endpoint returns a visible time-slot row and no booked/unavailable flag,
  // treat that specific court/time as available.
  return Boolean(getSlotStart(slot));
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`${url} failed: ${response.status}`);
  }

  return response.json();
}

function findSlotArrays(value, results = []) {
  if (!value || typeof value !== "object") return results;

  if (Array.isArray(value)) {
    const hasSlotShape = value.some((item) => {
      if (!item || typeof item !== "object") return false;

      return (
        item.start_time ||
        item.startTime ||
        item.start ||
        item.startAt ||
        item.start_at ||
        item.startDateTime ||
        item.start_datetime ||
        item.end_time ||
        item.endTime ||
        item.end ||
        item.endAt ||
        item.end_at ||
        item.time ||
        item.timeslot ||
        item.slot ||
        Object.prototype.hasOwnProperty.call(item, "isUnavailable") ||
        Object.prototype.hasOwnProperty.call(item, "isOccupied") ||
        Object.prototype.hasOwnProperty.call(item, "remainingQuota")
      );
    });

    if (hasSlotShape) {
      results.push(value);
      return results;
    }

    value.forEach((item) => findSlotArrays(item, results));
    return results;
  }

  Object.values(value).forEach((item) => findSlotArrays(item, results));
  return results;
}

function extractSlots(payload) {
  return findSlotArrays(payload).flat();
}

function buildExactCourtTimeslotUrl(courtId, dateString) {
  const apiDate = toGoparkApiDate(dateString);

  return `${GOPARK_API_BASE}/common/booking/${GOPARK_TENNIS_FACILITY_ID}/${courtId}/${apiDate}/timeslot`;
}

async function loadCourtSlots(court, dateString) {
  const url = buildExactCourtTimeslotUrl(court.id, dateString);
  const payload = await fetchJson(url);

  return {
    court,
    slots: extractSlots(payload),
  };
}

async function loadGoparkExactAvailabilityForDate(dateString) {
  const courtResults = await Promise.allSettled(
    GOPARK_TENNIS_COURTS.map((court) => loadCourtSlots(court, dateString))
  );

  const countByStart = new Map();
  const endByStart = new Map();

  courtResults.forEach((result) => {
    if (result.status !== "fulfilled") return;

    result.value.slots.forEach((slot) => {
      const start = getSlotStart(slot);
      const end = getSlotEnd(slot);

      if (!start) return;

      if (!endByStart.has(start) && end) {
        endByStart.set(start, end);
      }

      if (!isSlotAvailable(slot)) return;

      countByStart.set(start, (countByStart.get(start) || 0) + 1);
    });
  });

  return [...countByStart.entries()].map(([start, availableCourts], index) => ({
    id: `gopark-exact-${dateString}-${start}-${index}`,
    districtEN: "Sha Tin",
    districtTC: "沙田區",
    venueEN: "GO PARK Sai Sha Tennis Courts",
    venueTC: "西沙GO PARK網球場",
    addressEN: "9 Hoi Ying Road, Sai Sha, New Territories",
    addressTC: "新界西沙海映路9號",
    phone: "3168 2528",
    longitude: "114.265656",
    latitude: "22.427114",
    date: dateString,
    start,
    end: endByStart.get(start) || "",
    availableCourts,
    countIsExact: true,
    countType: "exact-court-count",
    source: "gopark",
  }));
}

export async function loadExternalTennisAvailability() {
  const dates = getNextBookingDatesHK(14);

  const results = await Promise.allSettled(
    dates.map((date) => loadGoparkExactAvailabilityForDate(date))
  );

  return results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );
}
