const API_BASE = "https://hk-court-proxy.vmflux-hk.workers.dev";

export const SMARTPLAY_URL = "https://www.smartplay.lcsd.gov.hk/website/en/";

export const SPORTS_CONFIG = {
  tennis: {
    id: "tennis",
    venueUrl: `${API_BASE}/facility/tennis`,
    availabilityUrl: `${API_BASE}/availability/tennis`,
    hasVenueMaster: true,
  },
  badminton: {
    id: "badminton",
    venueUrl: null,
    availabilityUrl: `${API_BASE}/availability/badminton`,
    hasVenueMaster: false,
  },
  squash: {
    id: "squash",
    venueUrl: null,
    availabilityUrl: `${API_BASE}/availability/squash`,
    hasVenueMaster: false,
  },
};

export const BEFORE_2PM_HOURS = Array.from({ length: 8 }, (_, index) => index + 6);
export const AFTER_2PM_HOURS = Array.from({ length: 9 }, (_, index) => index + 14);
export const FULL_DAY_HOURS = Array.from({ length: 17 }, (_, index) => index + 6);