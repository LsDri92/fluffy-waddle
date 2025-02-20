import { Container, Graphics, Point, Texture, TilingSprite } from "pixi.js";
import { PixiScene } from "../../engine/scenemanager/scenes/PixiScene";
import { Boat } from "./Boat";
import { Timer } from "../../engine/tweens/Timer";
import Random from "../../engine/random/Random";
import { LdtkMap } from "../../utils/LDTK/LdtkMap";
import rawData from "../tracks/track1.json";
import entData from "../tracks/track1/simplified/Level_0/data.json";
import { type ILDtkMap, parseLDtkJson } from "../../utils/LDTK/LDTKJson";
import { Hit } from "../../engine/collision/Hit";
import { HitPoly } from "../../engine/collision/HitPoly";
import { ScaleHelper } from "../../engine/utils/ScaleHelper";
import { ldtkSimpleJSON } from "../../utils/LDTK/EntitiesCreator";

export class MainBoatScene extends PixiScene {
	public static readonly BUNDLES = ["package-1"];

	private targetPosition: Array<Point> = [];
	private startPosition: Point;
	private currentTargetIndex: Array<number> = [0, 0, 0, 0];
	private waypointRadius: number;
	private boats: Array<Boat> = [];
	private start: boolean = false;
	private map: LdtkMap;
	private gameContainer: Container = new Container();
	private tilingWaves: TilingSprite;
	private sand: HitPoly;

	constructor() {
		super();

		this.addChild(this.gameContainer);

		const parsedMap: ILDtkMap = parseLDtkJson(rawData);

		this.map = new LdtkMap(parsedMap);
		const startPoint = ldtkSimpleJSON(entData.entities.Start_Point[0]);
		const targetPoint = ldtkSimpleJSON(entData.entities.PathPoints[0]);
		console.log(targetPoint);

		this.startPosition = new Point(startPoint.x, startPoint.y);

		for (let i = 0; i < targetPoint.customFields.Point.length; i++) {
			this.targetPosition.push(new Point(targetPoint.customFields.Point[i].cx, targetPoint.customFields.Point[i].cy));
		}

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

		this.tilingWaves = new TilingSprite(Texture.from("waves"), 1280, 720);

		this.sand = HitPoly.makeBox(this.tilingWaves.x, this.tilingWaves.height * 0.25, this.tilingWaves.width, 10);
		this.gameContainer.sortableChildren = true;
		this.gameContainer.addChild(this.tilingWaves, this.map, this.sand);

		for (let i = 0; i < 4; i++) {
			const boatData = ldtkSimpleJSON(entData.entities.Boats[i]);
			console.log(boatData);
			const boat = new Boat(
				boatData.customFields.MaxSpeed,
				boatData.customFields.acceleration,
				boatData.customFields.deceleration,
				boatData.customFields.turnSmooth,
				boatData.customFields.player,
				boatData.customFields.imgName
			);

			boat.position.set(this.startPosition.x + 80 * i, this.startPosition.y);
			this.boats.push(boat);
			this.addChild(boat);
		}

		const countdown = new Timer();
		countdown
			.to(3500)
			.start()
			.onComplete(() => {
				this.start = true;
			});
	}

	public override update(_dt: number): void {
		this.tilingWaves.tilePosition.x -= 0.1 * _dt;

		if (this.start) {
			this.boats.forEach((boat, index) => {
				boat.moveTowardTarget(this.targetPosition[this.currentTargetIndex[index]], _dt);
				const targetPosition = this.targetPosition[this.currentTargetIndex[index]];

				const distanceToTarget = Math.hypot(targetPosition.x - boat.position.x, targetPosition.y - boat.position.y);

				if (Hit.test(boat.hitbox, this.sand)) {
					const angle = Math.atan2(boat.position.y - this.sand.position.y, boat.position.x - this.sand.position.x);
					const separationForce = new Point(Math.cos(angle), Math.sin(angle));

					boat.position.x += separationForce.x;
					boat.position.y += separationForce.y;
				}

				// this.boats.forEach((otherBoat) => {
				// 	if (boat !== otherBoat) {
				// 		if (Hit.test(boat.hitbox, otherBoat.hitbox)) {
				// 			const dx = boat.position.x - otherBoat.position.x;
				// 			const dy = boat.position.y - otherBoat.position.y;
				// 			const distance = Math.hypot(dx, dy);

				// 			const repelForce = new Point(dx / distance, dy / distance);

				// 			const repulsionStrength = 25;
				// 			boat.position.x += repelForce.x * repulsionStrength;
				// 			boat.position.y += repelForce.y * repulsionStrength;

				// 			otherBoat.position.x -= repelForce.x * repulsionStrength;
				// 			otherBoat.position.y -= repelForce.y * repulsionStrength;

				// 			// boat.currentSpeed *= 0.01;
				// 			// otherBoat.currentSpeed *= 0.01;
				// 		}
				// 	}
				// });

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
		ScaleHelper.setScaleRelativeToScreen(this.gameContainer, _newW, _newH, 1, 1, ScaleHelper.FILL);
	}
}

let mapDataPromise: Promise<any> = loadMapData();

function loadMapData(): Promise<any> {
	return import(`../tracks/track1/simplified/Level_0/data.json?${Date.now()}`).then((module) => module.default || module);
}

export function getMapData(): Promise<any> {
	return mapDataPromise;
}

// Configurar HMR para que, cuando se modifique data.json, se recargue
if (module.hot) {
	module.hot.accept("../tracks/track1/simplified/Level_0/data.json", () => {
		// Reasigna la promesa para que se vuelva a cargar el JSON actualizado
		mapDataPromise = loadMapData();
		console.log("JSON actualizado por HMR");
	});
}
