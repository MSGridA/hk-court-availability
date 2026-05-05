import { SPORTS_CONFIG } from "../config";
import { SAMPLE_AVAILABILITY, SAMPLE_VENUES } from "../data/sampleData";
import { dmsToDecimal, normalizeKey, safeText } from "../lib/normalize";

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`${url} failed: ${response.status}`);
  }

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractRows(payload) {
  if (Array.isArray(payload)) return payload;

  if (typeof payload === "string") {
    try {
      return extractRows(JSON.parse(payload));
    } catch {
      return [];
    }
  }

  if (!payload || typeof payload !== "object") return [];

  const candidates = [
    payload.data,
    payload.result,
    payload.results,
    payload.items,
    payload.records,
    payload.contents,
    payload.content,
    payload.features,
  ];

  for (const candidate of candidates) {
    const rows = extractRows(candidate);
    if (rows.length) return rows;
  }

  for (const value of Object.values(payload)) {
    const rows = extractRows(value);
    if (rows.length) return rows;
  }

  return [];
}

function normalizeVenue(row, index) {
  const raw = row.properties || row;

  return {
    id: `${safeText(raw.Name_en || raw.Venue_Name_EN, "venue")}-${safeText(
      raw.District_en || raw.District_Name_EN,
      "district"
    )}-${index}`,
    districtEN: safeText(
      raw.District_en || raw.District_Name_EN || raw.District_Name_En,
      "Unknown"
    ),
    districtTC: safeText(raw.District_cn || raw.District_Name_TC || raw.District_Name_Tc),
    nameEN: safeText(raw.Name_en || raw.Venue_Name_EN, "Unnamed venue"),
    nameTC: safeText(raw.Name_cn || raw.Venue_Name_TC),
    addressEN: safeText(raw.Address_en || raw.Venue_Address_EN),
    addressTC: safeText(raw.Address_cn || raw.Venue_Address_TC),
    courts: safeText(
      raw.Court_no_en || raw.Court_No_EN || raw.Court_no || raw.Available_Courts,
      "—"
    ),
    openingEN: safeText(raw.Opening_hours_en || raw.Opening_Hours_EN),
    openingTC: safeText(raw.Opening_hours_cn || raw.Opening_Hours_TC),
    phone: safeText(raw.Phone || raw.Venue_Phone_No || raw["Venue_Phone_No."]),
    remarksEN: safeText(raw.Remarks_en),
    remarksTC: safeText(raw.Remarks_b5 || raw.Remarks_tc),
    longitude: dmsToDecimal(raw.Longitude || raw.Venue_Longitude),
    latitude: dmsToDecimal(raw.Latitude || raw.Venue_Latitude),
  };
}

function normalizeAvailability(row, index) {
  const raw = row.properties || row;

  return {
    id: `${safeText(raw.Venue_Name_EN || raw.Name_en, "venue")}-${safeText(
      raw.Available_Date,
      "date"
    )}-${safeText(raw.Session_Start_Time, "start")}-${index}`,
    districtEN: safeText(
      raw.District_Name_EN || raw.District_en || raw.District_Name_En,
      "Unknown"
    ),
    districtTC: safeText(raw.District_Name_TC || raw.District_cn || raw.District_Name_Tc),
    venueEN: safeText(raw.Venue_Name_EN || raw.Name_en, "Unnamed venue"),
    venueTC: safeText(raw.Venue_Name_TC || raw.Name_cn),
    addressEN: safeText(raw.Venue_Address_EN || raw.Address_en),
    addressTC: safeText(raw.Venue_Address_TC || raw.Address_cn),
    phone: safeText(raw.Venue_Phone_No || raw["Venue_Phone_No."] || raw.Phone),
    longitude: dmsToDecimal(raw.Venue_Longitude || raw.Longitude),
    latitude: dmsToDecimal(raw.Venue_Latitude || raw.Latitude),
    date: safeText(raw.Available_Date || raw.Date),
    start: safeText(raw.Session_Start_Time || raw.Start_Time),
    end: safeText(raw.Session_End_Time || raw.End_Time),
    availableCourts: Number(raw.Available_Courts || raw.Available_Court_No || 0),
  };
}

function buildVenuesFromAvailability(availabilityRows) {
  const map = new Map();

  for (const slot of availabilityRows) {
    const key = `${normalizeKey(slot.districtEN)}-${normalizeKey(slot.venueEN)}-${normalizeKey(
      slot.venueTC
    )}`;

    if (!map.has(key)) {
      map.set(key, {
        id: `${slot.venueEN}-${slot.districtEN}`,
        districtEN: slot.districtEN || "Unknown",
        districtTC: slot.districtTC,
        nameEN: slot.venueEN || "Unnamed venue",
        nameTC: slot.venueTC,
        addressEN: slot.addressEN,
        addressTC: slot.addressTC,
        courts: "—",
        openingEN: "",
        openingTC: "",
        phone: slot.phone,
        remarksEN: "",
        remarksTC: "",
        longitude: slot.longitude,
        latitude: slot.latitude,
      });
    }
  }

  return Array.from(map.values());
}

export async function loadSportData(sportId) {
  const config = SPORTS_CONFIG[sportId];

  if (!config || !config.availabilityUrl) {
    return {
      venues: [],
      availability: [],
      status: "placeholder",
      error: "",
    };
  }

  try {
    const availabilityPayload = await fetchJson(config.availabilityUrl);

    const availability = extractRows(availabilityPayload)
      .map(normalizeAvailability)
      .filter((slot) => slot.venueEN || slot.venueTC);

    let venues = [];

    if (config.hasVenueMaster && config.venueUrl) {
      const venuePayload = await fetchJson(config.venueUrl);

      venues = extractRows(venuePayload)
        .map(normalizeVenue)
        .filter((venue) => venue.nameEN || venue.nameTC);
    } else {
      venues = buildVenuesFromAvailability(availability);
    }

    if (!venues.length) {
      throw new Error(`No ${sportId} venues found.`);
    }

    return {
      venues,
      availability,
      status: "ready",
      error: "",
    };
  } catch (err) {
    if (sportId === "tennis") {
      return {
        venues: SAMPLE_VENUES.map(normalizeVenue),
        availability: SAMPLE_AVAILABILITY.map(normalizeAvailability),
        status: "sample",
        error: err.message || "Unable to load live LCSD data. Showing sample data instead.",
      };
    }

    return {
      venues: [],
      availability: [],
      status: "error",
      error: err.message || `Unable to load ${sportId} data.`,
    };
  }
}
