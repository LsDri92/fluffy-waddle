import { Rectangle } from "@pixi/core";

export interface IHitbox {
	getHitbox(): Rectangle;
}

export function checkColission(objA: IHitbox, objB: IHitbox): Rectangle | null {
	const rA = objA.getHitbox();
	const rB = objB.getHitbox();

	const rigthmostLeft = rA.left < rB.left ? rB.left : rA.left;
	const leftmostRigth = rA.right > rB.right ? rB.right : rA.right;
	const bottommostTop = rA.top < rB.top ? rB.top : rA.top;
	const topmostBottom = rA.bottom > rB.bottom ? rB.bottom : rA.bottom;

	const makeSenseHorizontal = rigthmostLeft < leftmostRigth;
	const makeSenseVertical = bottommostTop < topmostBottom;
	if (makeSenseHorizontal && makeSenseVertical) {
		const retval = new Rectangle();

		retval.x = rigthmostLeft;
		retval.y = bottommostTop;
		retval.width = leftmostRigth - rigthmostLeft;
		retval.height = topmostBottom - bottommostTop;

		return retval;
	} else {
		return null;
	}
}
