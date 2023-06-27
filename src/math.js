export const toPoint = ({ x = 0, y = 0, z = 0 } = {}) => ({ x, y, z});

export const dotProduct = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];

export const magnitude = v => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

export const toVector = (p1, p2) => [p1.x - p2.x, p1.y - p2.y, p1.z - p2.z];

export const toDegree = angle => angle * 180 / Math.PI;

export const toRadian = angle => angle / 180 * Math.PI;

export const getAngle = (p1, p2, p3) => {
	const v1 = toVector(p2, p1);
	const v2 = toVector(p2, p3);
	const cos = dotProduct(v1, v2) / magnitude(v1) / magnitude(v2);
	const angle = Math.acos(cos);
	return angle;
}

export const getCenter = (p1, p2) => ({
	x: (p1.x + p2.x) / 2,
	y: (p1.y + p2.y) / 2,
	z: (p1.z + p2.z) / 2
});

export const zAxisRotation = (p, angle) => ({
	x: p.x * Math.cos(angle) + p.y * -Math.sin(angle) + p.z * 0,
	y: p.x * Math.sin(angle) + p.y * Math.cos(angle) + p.z * 0,
	z: p.x * 0 + p.y * 0 + p.z * 1
})