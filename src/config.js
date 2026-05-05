export const SMARTPLAY_URL = "https://www.smartplay.lcsd.gov.hk/website/en/";

export const SPORTS_CONFIG = {
  tennis: {
    id: "tennis",
    venueUrl: "https://www.lcsd.gov.hk/datagovhk/facility/facility-tc.json",
    availabilityUrl:
      "https://data.smartplay.lcsd.gov.hk/rest/cms/api/v1/publ/contents/open-data/tennis/file",
    hasVenueMaster: true,
  },
  badminton: {
    id: "badminton",
    venueUrl: null,
    availabilityUrl:
      "https://data.smartplay.lcsd.gov.hk/rest/cms/api/v1/publ/contents/open-data/badminton/file",
    hasVenueMaster: false,
  },
  squash: {
    id: "squash",
    venueUrl: null,
    availabilityUrl:
      "https://data.smartplay.lcsd.gov.hk/rest/cms/api/v1/publ/contents/open-data/squash/file",
    hasVenueMaster: false,
  },
};

export const BEFORE_2PM_HOURS = Array.from({ length: 8 }, (_, index) => index + 6); // 06:00-14:00
export const AFTER_2PM_HOURS = Array.from({ length: 9 }, (_, index) => index + 14); // 14:00-23:00
export const FULL_DAY_HOURS = Array.from({ length: 17 }, (_, index) => index + 6); // 06:00-23:00
