import { Container, Point, Sprite, Text } from "pixi.js";
import { HitPoly } from "../../engine/collision/HitPoly";

export class Boat extends Container {
	private maxSpeed: number;
	public acce: number;
	public dece: number;
	public currentSpeed: number;
	public boat: Sprite;
	public turnsSmooth: number;
	private turnVelocity = { value: 0 };
	public hitbox: HitPoly;

	public id: number;

	constructor(maxSpeed: number, acceleration: number, deceleration: number, turnSmooth: number, player: number, sprite: string) {
		super();
		this.id = player;
		this.currentSpeed = 0;
		this.maxSpeed = maxSpeed * 0.001;
		this.acce = acceleration * 0.001;
		this.dece = deceleration * 0.001;
		this.turnsSmooth = turnSmooth;
		this.rotation = -5;

		this.boat = Sprite.from(sprite);
		this.boat.angle = -90;
		this.boat.scale.set(0.5);
		this.boat.anchor.x = 0.5;
		this.boat.anchor.y = 0;

		const text = new Text(player.toString());
		text.position.set(this.boat.x, this.boat.y);

		this.hitbox = HitPoly.makeBox(this.boat.x - this.boat.width * 0.5, this.boat.y, this.boat.width, this.boat.height);
		this.hitbox.angle = this.boat.angle;
		this.addChild(this.boat, this.hitbox, text);
	}

	public turnBoat(targetPosition: Point, dt: number): void {
		const pointToTarget = new Point(targetPosition.x - this.position.x, targetPosition.y - this.position.y);
		const angleToTarget = Math.atan2(pointToTarget.y, pointToTarget.x);

		let deltaAngle = angleToTarget - this.rotation;
		deltaAngle = ((deltaAngle + Math.PI) % (2 * Math.PI)) - Math.PI;

		this.rotation = this.smoothDampAngle(this.rotation, this.rotation + deltaAngle, this.turnVelocity, this.turnsSmooth, dt);
	}
	public moveTowardTarget(targetPosition: Point, deltaTime: number): number {
		this.turnBoat(targetPosition, deltaTime);

		const dx = targetPosition.x - this.position.x;
		const dy = targetPosition.y - this.position.y;
		const distanceToTarget = Math.sqrt(dx * dx + dy * dy);

		const threshold = 120;

		if (distanceToTarget > threshold) {
			this.currentSpeed += this.acce * deltaTime;
		} else {
			this.currentSpeed -= (this.dece * deltaTime) / 60;
		}

		if (this.currentSpeed > this.maxSpeed) {
			this.currentSpeed = this.maxSpeed;
		}

		this.position.x += Math.cos(this.rotation) * this.currentSpeed * deltaTime;
		this.position.y += Math.sin(this.rotation) * this.currentSpeed * deltaTime;

		return this.currentSpeed;
	}

	private smoothDampAngle(current: number, target: number, currentVelocity: { value: number }, smoothTime: number, deltaTime: number): number {
		const pi2 = Math.PI * 2;

		const deltaAngle = ((target - current + Math.PI) % pi2) - Math.PI;

		return this.smoothDamp(current, current + deltaAngle, currentVelocity, smoothTime, deltaTime);
	}

	private smoothDamp(current: number, target: number, velocity: { value: number }, smoothTime: number, deltaTime: number): number {
		const omega = 2 / smoothTime;
		const x = omega * deltaTime;
		const exp = 1 / (1 + x + 0.48 * x ** 2 + 0.235 * x ** 3);
		const change = current - target;
		const temp = (velocity.value + omega * change) * deltaTime;
		velocity.value = (velocity.value - omega * temp) * exp;
		return target + (change + temp) * exp;
	}
}
