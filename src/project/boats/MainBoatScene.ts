import type { Point } from "pixi.js";
import { Container, Graphics, Texture, TilingSprite } from "pixi.js";
import { PixiScene } from "../../engine/scenemanager/scenes/PixiScene";
import type { Boat } from "./Boat";
import { Timer } from "../../engine/tweens/Timer";
import Random from "../../engine/random/Random";
import { LdtkMap } from "../../utils/LDTK/LdtkMap";
import rawData from "../tracks/track1.json";
import { type ILDtkMap, parseLDtkJson } from "../../utils/LDTK/LDTKJson";
import { ScaleHelper } from "../../engine/utils/ScaleHelper";

export class MainBoatScene extends PixiScene {
	public static readonly BUNDLES = ["package-1"];

	private targetPosition: Array<Point> = [];
	// private startPosition: Point;
	private currentTargetIndex: Array<number> = [0, 0, 0, 0];
	private waypointRadius: number;
	private boats: Array<Boat> = [];
	private start: boolean = false;
	private map: LdtkMap;
	private gameContainer: Container = new Container();
	private tilingWaves: TilingSprite;
	// private camera: Camera2D;

	constructor() {
		super();

		this.addChild(this.gameContainer);

		const parsedMap: ILDtkMap = parseLDtkJson(rawData);

		// Parseamos el JSON LDtk

		// Ahora, utilizando el EntitiesCreator, creamos las entidades del juego basándonos en el mapa parseado
		console.log(parsedMap);

		this.map = new LdtkMap(parsedMap);
		// const startPoint = 0;
		// const targetPoint = 0;

		// this.startPosition = new Point(startPoint, startPoint);

		this.waypointRadius = 100;

		this.targetPosition.forEach((target) => {
			const aux = new Graphics();
			aux.zIndex = 1000;
			aux.beginFill(0xffff00);
			aux.drawCircle(0, 0, 5);
			aux.endFill();
			aux.position.set(target.x, target.y);
			this.map.addChild(aux);
		});

		this.tilingWaves = new TilingSprite(Texture.from("waves"), this.map.width, this.map.height);

		this.gameContainer.sortableChildren = true;
		this.gameContainer.addChild(this.tilingWaves, this.map);

		// for (let i = 0; i < 4; i++) {
		// 	const boatData = ldtkSimpleJSON(entities.customFields.Boats[i]);
		// 	console.log(boatData);
		// 	const boat = new Boat(
		// 		boatData.customFields.MaxSpeed,
		// 		boatData.customFields.acceleration,
		// 		boatData.customFields.deceleration,
		// 		boatData.customFields.turnSmooth,
		// 		boatData.customFields.player,
		// 		boatData.customFields.imgName
		// 	);

		// 	boat.position.set(this.startPosition.x + 80 * i, this.startPosition.y);
		// 	this.boats.push(boat);
		// 	this.gameContainer.addChild(boat);
		// }

		const countdown = new Timer();
		countdown
			.to(3500)
			.start()
			.onComplete(() => {
				this.start = true;
			});
	}

	public override update(_dt: number): void {
		// this.camera.anchoredOnCharacterWithLerp(this.gameContainer, this.boats[1], 0.2);
		// this.gameContainer.scale.set(1.5);
		this.tilingWaves.tilePosition.x -= 0.1 * _dt;

		if (this.start) {
			this.boats.forEach((boat, index) => {
				boat.moveTowardTarget(this.targetPosition[this.currentTargetIndex[index]], _dt);
				const targetPosition = this.targetPosition[this.currentTargetIndex[index]];

				const distanceToTarget = Math.hypot(targetPosition.x - boat.position.x, targetPosition.y - boat.position.y);

				const randomRadius = Random.shared.random(this.waypointRadius * 0.5, this.waypointRadius);

				if (distanceToTarget < randomRadius) {
					console.log(boat.currentSpeed);
					this.goToNextTarget(index);
				}
			});
		}
	}

	private goToNextTarget(index: number): void {
		this.currentTargetIndex[index] = (this.currentTargetIndex[index] + 1) % this.targetPosition.length;
	}

	public override onResize(_newW: number, _newH: number): void {
		this.gameContainer.x = _newW / 2;
		this.gameContainer.y = _newH / 2;
		ScaleHelper.setScaleRelativeToScreen(this.gameContainer, _newW, _newH, 1, 1, ScaleHelper.FILL);
	}
}
