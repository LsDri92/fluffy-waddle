import type { Body } from "matter-js";
import { Bodies, World } from "matter-js";
import { Container, Graphics } from "pixi.js";
import { engine } from "../..";

export class Ball extends Container {
	public ball: { sprite: Graphics; ballBody: Body };
	constructor() {
		super();
	}

	public createBall(): void {
		// Crear cuerpo físico para la pelota
		const ballBody = Bodies.circle(512, 384, 15, { restitution: 0.9 });
		World.add(engine.world, ballBody);

		// Crear sprite para la pelota
		const ballSprite = new Graphics();
		ballSprite.beginFill(0xffffff);
		ballSprite.drawCircle(0, 0, 15);
		ballSprite.endFill();
		ballSprite.x = ballBody.position.x;
		ballSprite.y = ballBody.position.y;
		this.addChild(ballSprite);

		this.ball = { sprite: ballSprite, ballBody: ballBody };
	}
}
