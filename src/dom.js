export const loading = message => {
	console.log(message);

	let el = document.getElementById('loading');
	if (!el) {
		el = document.createElement('div');
		el.id = 'loading';
		el.style.position = 'absolute';
		el.style.top = 0;
		el.style.left = 0;
		el.style.display = 'flex';
		el.style.alignItems = 'center';
		el.style.justifyContent = 'center';
		el.style.width = '100vw';
		el.style.height = '100vh';
		el.style.fontSize = '3vw';
		el.style.color = 'black';
		document.body.appendChild(el);
	}

	el.innerHTML = message;
}

export const ready = () => {
	let el = document.getElementById('loading');
	if (el) {
		el.remove();
	}
}

export const initDocument = () => {
	loading('Initializing document...');
	document.body.style.margin = 0;
	document.body.style.width = '100vw';
	document.body.style.height = 'fit-content';
	document.body.style.position = 'relative';
};

export const initCanvas = () => {
	loading('Initializing canvas...');
	const canvas = document.createElement('canvas');
	canvas.style.width = '100%';
	document.body.append(canvas);

	return canvas;
}

export const initImage = async (canvas, src) => new Promise(resolve => {
	loading('Initializing image...');
	const image = document.createElement('img');

	image.onload = () => {
		canvas.width = image.width;
		canvas.height = image.height;
		
		const context = canvas.getContext('2d');
		context.drawImage(image, 0, 0);
		
		const imageData = context.getImageData(0, 0, image.width, image.height);
		resolve(imageData);
	};

	image.src = src;
});

export const initCamera = async (canvas, onFrame) => {
	loading('Initializing camera...');

	const stream = await navigator.mediaDevices.getUserMedia({
		video: {
			width: document.body.clientWidth
		}
	});

	const streamSettings = stream.getVideoTracks()[0].getSettings();
	canvas.width = streamSettings.width;
	canvas.height = streamSettings.height;

	const video = document.createElement('video');
	video.style.width = canvas.width;

	video.addEventListener('loadedmetadata', () => {
		const context = canvas.getContext('2d');

		const drawFrame = async () => {
			context.drawImage(video, 0, 0);
			onFrame();
			window.requestAnimationFrame(drawFrame);
		};

		drawFrame();
	});

	video.autoplay = true;
	video.srcObject = stream;

	await video.play();
}

export const alertMessage = message => {
	let el = document.getElementById('alert');
	if (!el) {
		el = document.createElement('div');
		el.id = 'alert';
		el.style.position = 'absolute';
		el.style.top = 0;
		el.style.bottom = 0;
		el.style.marginTop = 'auto';
		el.style.marginBottom = 'auto';
		el.style.left = 0;
		el.style.right = 0;
		el.style.marginLeft = 'auto';
		el.style.marginRight = 'auto';
		el.style.padding = '2vw';
		el.style.width = '75%';
		el.style.height = 'fit-content';
		el.style.textAlign = 'center';
		el.style.fontSize = '3vw';
		el.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
		el.style.color = 'white';
		el.style.textTransform = 'uppercase';

		document.body.appendChild(el);
	}

	el.innerHTML = message;
}

export const clearAlert = () => {
	let el = document.getElementById('alert');
	if (el) {
		el.remove();
	}
}

export const startRestInterval = ms => {
	let el = document.getElementById('timer');
	if (!el) {
		el = document.createElement('div');
		el.id = 'timer';
		el.style.position = 'absolute';
		el.style.top = 0;
		el.style.bottom = 0;
		el.style.marginTop = 'auto';
		el.style.marginBottom = 'auto';
		el.style.left = 0;
		el.style.right = 0;
		el.style.marginLeft = 'auto';
		el.style.marginRight = 'auto';
		el.style.padding = '2vw';
		el.style.width = '75%';
		el.style.height = 'fit-content';
		el.style.textAlign = 'center';
		el.style.fontSize = '3vw';
		el.style.backgroundColor = 'rgba(190, 190, 190, 0.7)';
		el.style.color = 'white';
		el.style.textTransform = 'uppercase';
		document.body.appendChild(el);
	}

	el.innerHTML = `Rest<br /><strong>${ms / 1000}<strong>`;

	setInterval(() => {
		ms -= 1000;
		el.innerHTML = `Rest<br /><strong>${ms / 1000}<strong>`;
	}, 1000);

	return new Promise(resolve => setTimeout(() => {
		el.remove();
		resolve();
	}, ms))
}

export const initStatsContainer = title => {
	let el = document.getElementById('stats');
	if (!el) {
		el = document.createElement('div');
		el.id = 'stats';
		el.style.position = 'absolute';
		el.style.top = '2vw';
		el.style.left = '2vw';
		el.style.padding = '1vw';
		el.style.minWidth = '20%';
		el.style.display = 'flex';
		el.style.flexDirection = 'column';
		el.style.gridGap = '1vw';
		el.style.fontSize = '3vw';
		el.style.backgroundColor = 'gray';
		el.style.opacity = 0.5;
		el.style.color = 'white';

		document.body.appendChild(el);
	}

	if (title) {
		let titleEl = document.getElementById('stats-title');
		if (!titleEl) {
			titleEl = document.createElement('div');
			titleEl.id = 'statis-title';
			titleEl.style.fontWeight = 700;

			el.appendChild(titleEl);
		}

		titleEl.innerHTML = title;
	}

	return el;
}

export const printAngle = angle => {
	let el = document.getElementById('angle-value');
	if (!el) {
		el = document.createElement('div');
		el.id = 'angle-value';
		
		const stats = initStatsContainer();
		stats.appendChild(el);
	}

	el.textContent = `Angle: ${angle.toFixed(2)}°`;
};

export const printRepetitions = repetitions => {
	let el = document.getElementById('repetitions-value');
	if (!el) {
		el = document.createElement('pre');
		el.id = 'repetitions-value';
		el.style.margin = 0;

		const stats = initStatsContainer();
		stats.appendChild(el);
	}

	el.innerHTML = repetitions.map((repetition, set) => `Set ${set + 1}\t${repetition} reps`).join('\n');
};

export const printProgressBar = (min, max, value) => {
	let container = document.getElementById('progress-bar');
	if (!container) {
		container = document.createElement('div');
		container.id = 'progress-bar';
		container.style.position = 'absolute';
		container.style.top = '2vw';
		container.style.right = '2vw';
		container.style.width = '40px';
		container.style.height = '160px';
		container.style.backgroundColor = 'white';
		container.style.border = '1px solid litegray';
		document.body.appendChild(container);
	}

	let indicator = document.getElementById('progress-bar-indicator');
	if (!indicator) {
		indicator = document.createElement('div');
		indicator.id = 'progress-bar-indicator';
		indicator.style.position = 'absolute';
		indicator.style.bottom = '0px';
		indicator.style.width = '100%';
		indicator.style.backgroundImage = 'linear-gradient(0deg, rgba(255,0,0,0.25) 0%, rgba(255,0,0,1) 100%)';
		indicator.style.backgroundSize = '100% 160px';
		indicator.style.backgroundRepeat = 'no-repeat';
		indicator.style.backgroundPosition = 'bottom';
		container.appendChild(indicator);
	}
	indicator.style.height = `${(value - min) / (max - min) * 100}%`;

	let target = document.getElementById('progress-bar-target');
	if (!target) {
		target = document.createElement('div');
		target.id = 'progress-bar-target';
		target.style.position = 'absolute';
		target.style.width = '100%';
		target.style.height = '4px';
		target.style.background = 'darkgray';

		target.animate([
			{ transform: "translateY(160px)" },
			{ transform: "translateY(0px)" },
		], {
			duration: 1800,
			iterations: Infinity,
			easing: 'ease-in-out',
			direction: 'alternate'
		});

		container.appendChild(target);
	}
};
