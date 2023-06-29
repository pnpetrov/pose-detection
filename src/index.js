import { initModel, estimatePosture } from './model.js';
import { initDocument, initCanvas, initCamera, ready, initStatsContainer, alertMessage, clearAlert, startRestInterval } from './dom.js';
import { initBicepsCurl } from './biceps-curl.js';

const badPosture = (() => {
	let timeout = null;

	const alert = (delay = 200) => {
		timeout = setTimeout(() => alertMessage('Bad posture!'), delay);
	};

	const clear = () => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
		clearAlert()
	};

	return { alert, clear };
})();

const restBetweenSets = (() => {
	const rest = {
		isResting: false
	};

	rest.start = async (restInterval = 10 * 1000) => {
		rest.isResting = true;
		await startRestInterval(restInterval);
		rest.isResting = false;
	};

	return rest;
})();

const testLive = async () => {
	initDocument();
	const canvas = initCanvas();
	
	const detector = await initModel();

	initStatsContainer('Biceps curls (right arm)');

	const onPostureChange = initBicepsCurl(canvas, { 
		onBadPosture: badPosture.alert,
		onRestBetweenSets: restBetweenSets.start
	});

	await initCamera(canvas, async () => {
		if (restBetweenSets.isResting) {
			return;
		}

		const posture = await estimatePosture(detector, canvas);

		if (!posture || posture.keypoints === 0) {
			badPosture.alert();
			return
		}

		const successfullyProcessed = await onPostureChange(posture);
		if (successfullyProcessed) {
			badPosture.clear();
		}
	});

	ready();
}

testLive();
