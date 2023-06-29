import { getRightArm } from './model.js';
import { magnitude, toVector, getAngle, toDegree, getCenter, zAxisRotation } from './math.js';
import { drawPattern } from './draw.js';
import { printAngle, printRepetitions, printProgressBar, rest } from './dom.js';

const getShouldersWidth = (p1, p2) => {
	const vector = toVector(p1, p2);
	const width = magnitude(vector);
	return width;
}

const calculateCorrectionAngle = (shoulderNodes, shouldersWidth) => {
	const [p1, p2] = shoulderNodes;
	// const vector = pointToVector(p2, p1);
	// const length = magnitude(vector);

	// const p1Up = { x: p1.x, y: 0 };
	// const p2Up = { x: p2.x, y: 0 };
	// const p3Up = { x: p2Up.x, y: 1 };

	// const correctionAngle = getAngle(p1Up, p2Up, p3Up);
	// console.log(correctionAngle);

	const width = Math.abs(p1.x - p2.x);
	const sin = width / shouldersWidth;
	const angle = Math.asin(sin);
	return angle;
}

const correctPoint = (p, origin, angle) => {
	const length = Math.abs(p.x - origin.x);
	const x = Math.sin(angle / 180 * Math.PI) * length;
	return { x, y: p.y };
};

const ARM_POINTS_COUNT = 3;

const SCORE_THRESHOLD = 0.4;

const TOP_ANGLE = 50;
const BOTTOM_ANGLE = 150;

const REPETITION_THRESHOLD_INTERVAL = 5 * 1000;
const REST_INTERVAL = 10 * 1000;

const isTrustful = (points, minScore = 0.5) => points.every(point => point.score >= minScore);

export const initBicepsCurl = (canvas, { onBadPosture }) => {
	let set = 0;
	let repetitions = [0];
	let isNewRepetition = false;

	let resetInterval = null;
	
	let isInRest = false;

	const onPostureChange = async posture => {
		if (isInRest) {
			return true;
		}

		const armPoints = getRightArm(posture);
		if (armPoints.length !== ARM_POINTS_COUNT || !isTrustful(armPoints, SCORE_THRESHOLD)) {
			onBadPosture();
			return false;
		}

		drawPattern(canvas, armPoints);

		const elbowAngle = toDegree(getAngle(...armPoints));
		printAngle(elbowAngle);

		if (elbowAngle <= TOP_ANGLE) {
			isNewRepetition = true;
		} else if (elbowAngle >= BOTTOM_ANGLE) {
			if (isNewRepetition) {
				repetitions[set]++;
				isNewRepetition = false;
			}

			if (repetitions[set] > 0 && !resetInterval) {
				resetInterval = setTimeout(async () => {
					set += 1;
					repetitions.push(0);

					isInRest = true;
					await rest(REST_INTERVAL);
					isInRest = false;
				}, REPETITION_THRESHOLD_INTERVAL);
			}
		} else if (elbowAngle < BOTTOM_ANGLE) {
			if (resetInterval) {
				clearTimeout(resetInterval);
				resetInterval = null;
			}
		}

		printRepetitions(repetitions);
		printProgressBar(BOTTOM_ANGLE, TOP_ANGLE, elbowAngle);

		return true;
	};

	return onPostureChange;
};
