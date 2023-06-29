import { initModel, estimatePosture, getRightArm } from './model.js';
import { initDocument, initCanvas, initImage, initCamera, ready, initStatsContainer, printAngle, alertMessage, clearAlert } from './dom.js';
import { drawPattern } from './draw.js';
import { initBicepsCurl } from './biceps-curl.js';

const test = async () => {
	initDocument();
	const canvas = initCanvas();
	await initImage(canvas, './public/images/2.png');
	
	const detector = await initModel();

	ready();

	const posture = await estimatePosture(detector, canvas);
	const points = getRightArm(posture);
	drawPattern(canvas, points);
	printAngle(getAngle(...points));
};

const testLive = async () => {
	initDocument();
	const canvas = initCanvas();
	
	const detector = await initModel();

	initStatsContainer('Biceps curls (right arm)');

	const onPostureChange = initBicepsCurl(canvas);

	await initCamera(canvas, async () => {
		ready();

		const posture = await estimatePosture(detector, canvas);

		let alert = null;
		if (!posture || posture.keypoints === 0) {
			alert = alert || setTimeout(() => alertMessage('Bad posture!'), 100);
			return
		}

		clearTimeout(alert);
		clearAlert();
		alert = null;

		onPostureChange(posture);
	});
}

// test();
testLive();
