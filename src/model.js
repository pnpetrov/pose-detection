import * as poseDetection from '@tensorflow-models/pose-detection';

import * as tf from '@tensorflow/tfjs-core';

import '@tensorflow/tfjs-backend-webgl';

import { loading } from './dom.js';
import { toPoint } from './math.js';

const initTf = async () => {
	loading('Initializing TensorFlow...');
	await tf.setBackend('webgl');
}

export const initModel = async () => {
	await initTf();

	loading('Initializing model...');

	const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
		modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
		minPoseScore: 0.53
	});

	// const detector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
	// 	runtime: 'tfjs',
	// 	modelType: 'full'
	// });

	return detector;
};

export const estimatePosture = async (detector, source) => {
	const postures = await detector.estimatePoses(source);
	const posture = postures.pop();
	return posture;
}

const findByName = (keypoints = [], name) => keypoints.find(keypoint => keypoint.name === name);

const getKeyPoints = (...names) => keypoints => names.map(name => findByName(keypoints, name)).filter(Boolean).map(toPoint);

export const getShoulders = posture => getKeyPoints(
	'left_shoulder',
	'right_shoulder'
)(posture.keypoints);

export const getRightArm = posture => getKeyPoints(
	'right_shoulder',
	'right_elbow',
	'right_wrist'
)(posture.keypoints);