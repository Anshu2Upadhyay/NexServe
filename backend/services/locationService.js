const calculateDistance = (latitude1, longitude1, latitude2, longitude2) => {
    const earthRadius = 6371;

    const latDifference = toRadians(latitude2 - latitude1);
    const lonDifference = toRadians(longitude2 - longitude1);

    const firstPoint = toRadians(latitude1);
    const secondPoint = toRadians(latitude2);

    const a =
        Math.sin(latDifference / 2) * Math.sin(latDifference / 2) +
        Math.cos(firstPoint) *
            Math.cos(secondPoint) *
            Math.sin(lonDifference / 2) *
            Math.sin(lonDifference / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
};

const toRadians = (value) => {
    return (value * Math.PI) / 180;
};

module.exports = {
    calculateDistance
};