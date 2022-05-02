/**
 * @param point1 coordinate Point in 3 Dimension
 * @param point2 coordinate Point in 3 Dimension
 * @return distance bt 2 points in coordinate system
 */

 const distanceBtwTwoCoordinatePoints = function (point1, point2) {
    var a = point1[0] - point2[0];
    var b = point1[1] - point2[1];
    var c = point1[2] - point2[2];
    return Math.sqrt(a * a + b * b + c * c);
}


/**
 * @param coordinatePoints array of coordinate Point in 3 Dimension
 * @param minDistance minimum distance two coordinate points
 * @return array with removed all minimum distance points
 */
const removePointsWithLessDistance = function (coordinatePoints, minDistance) {
    let coordinatePointsData = [];
    let prev = coordinatePoints[0];
    coordinatePointsData.push(prev);
    for (let i = 1; i < coordinatePoints.length; i++) {
        let curr = coordinatePoints[i];
        let dist = distanceBtwTwoCoordinatePoints(curr, prev);
        if (dist > minDistance) {
            prev = curr;
            coordinatePointsData.push(curr);
        }
    }
    return coordinatePointsData;
}

