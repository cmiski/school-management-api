// haversine formula for geo distance

const toRadians = (degree) => {
  return degree * (Math.PI / 180);
};

const calculateDistance = (userLat, userLon, schoolLat, schoolLon) => {
  const earthRadius = 6371;

  const dLat = toRadians(schoolLat - userLat);
  const dLon = toRadians(schoolLon - userLon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(userLat)) *
      Math.cos(toRadians(schoolLat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

export default calculateDistance;
