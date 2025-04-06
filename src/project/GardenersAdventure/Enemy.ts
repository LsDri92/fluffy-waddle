import { AnimatedSprite, Container, Texture } from "pixi.js";
import { HitPoly } from "../../engine/collision/HitPoly";

export class Enemy extends Container {
	private spr: AnimatedSprite;
	public hitbox: HitPoly;
	constructor() {
		super();
		this.spr = new AnimatedSprite(
			[
				Texture.from("img/big_placeholder/ant/01.png"),
				Texture.from("img/big_placeholder/ant/02.png"),
				Texture.from("img/big_placeholder/ant/03.png"),
				Texture.from("img/big_placeholder/ant/04.png"),
				Texture.from("img/big_placeholder/ant/05.png"),
				Texture.from("img/big_placeholder/ant/11.png"),
				Texture.from("img/big_placeholder/ant/06.png"),
				Texture.from("img/big_placeholder/ant/07.png"),
				Texture.from("img/big_placeholder/ant/08.png"),
				Texture.from("img/big_placeholder/ant/09.png"),
				Texture.from("img/big_placeholder/ant/11.png"),
				Texture.from("img/big_placeholder/ant/10.png"),
			],
			true
		);
		this.spr.play();
		this.spr.animationSpeed = 0.08;
		this.spr.anchor.set(0.5, 1);
		this.spr.scale.set(-0.55, 0.55);
		this.hitbox = HitPoly.makeBox(this.spr.x, this.spr.y, this.spr.width, this.spr.height);
		this.addChild(this.spr, this.hitbox);
	}
	public update(dt: number): void {
		this.position.x -= dt * 0.16 * 0.4;
	}
}
