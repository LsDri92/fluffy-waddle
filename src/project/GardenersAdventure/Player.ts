import { Container, Sprite } from "pixi.js";
import { Keyboard } from "../../engine/input/Keyboard";
import { Key } from "../../engine/input/Key";
import { HitPoly } from "../../engine/collision/HitPoly";

export class Player extends Container {
	private sprite: Sprite;
	public hitbox: HitPoly;
	constructor(spr: string) {
		super();
		this.sprite = Sprite.from(spr);
		this.sprite.scale.set(0.35);
		this.sprite.anchor.set(0.5, 1);

		this.hitbox = HitPoly.makeBox(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
		this.addChild(this.sprite, this.hitbox);
	}
	public update(dt: number): void {
		dt;
		if (Keyboard.shared.justPressed(Key.UP_ARROW)) {
		}
		if (Keyboard.shared.justPressed(Key.DOWN_ARROW)) {
		}
	}
}
