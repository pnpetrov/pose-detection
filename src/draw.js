export const clear = canvas => {
	const context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
}

export const drawNode = (canvas, { x, y }, color = '#00FF00') => {
	const context = canvas.getContext("2d");
	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, 5, 0, 2 * Math.PI);
	context.fill();
}

export const drawLine = (canvas, from, to, color = "#00FF00") => {
	const context = canvas.getContext("2d");
	context.strokeStyle = color;
	context.lineWidth = 3;
	context.beginPath();
	context.moveTo(from.x, from.y);
	context.lineTo(to.x, to.y);
	context.stroke();
}

export const drawPattern = (canvas, nodes, color) => {
	for (let index = 0; index < nodes.length; index++) {
		const node = nodes[index];
		drawNode(canvas, node, color);

		const nextNode = nodes[index + 1];
		if (nextNode) {
			drawLine(canvas, node, nextNode, color);
		}
	}
}
