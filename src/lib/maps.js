export function makeGoogleMapUrl(venue) {
  const hasCoord = venue.latitude && venue.longitude;

  if (hasCoord) {
    return `https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${venue.nameEN} ${venue.addressEN} Hong Kong`
  )}`;
}
