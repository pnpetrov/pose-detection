import { getRightArm } from './model.js';
import { getAngle, toDegree } from './math.js';
import { drawPattern } from './draw.js';
import { printAngle, printRepetitions, printProgressBar } from './dom.js';

const ARM_POINTS_COUNT = 3;

const SCORE_THRESHOLD = 0.4;

const TOP_ANGLE = 50;
const BOTTOM_ANGLE = 150;

const REPETITION_THRESHOLD_INTERVAL = 3 * 1000;

const isTrustful = (points, minScore = 0.5) => points.every(point => point.score >= minScore);

export const initBicepsCurl = (canvas, { onBadPosture, onRestBetweenSets }) => {
	let set = 0;
	let repetitions = [0];
	let isNewRepetition = false;

	let resetInterval = null;

	const onPostureChange = async posture => {
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
					await onRestBetweenSets();

					set += 1;
					repetitions.push(0);
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
