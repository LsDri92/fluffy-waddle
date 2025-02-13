/* eslint-disable @typescript-eslint/naming-convention */
import { Container, Graphics, Point, Texture, TilingSprite } from "pixi.js";
import { PixiScene } from "../../engine/scenemanager/scenes/PixiScene";
import { Boat } from "./Boat";
import { Timer } from "../../engine/tweens/Timer";
import Random from "../../engine/random/Random";
import { LdtkMap } from "../../utils/LDTK/LdtkMap";
import rawData from "../tracks/track1.json";
import type { ILDtkMap, TileData, EntityInstance, LayerInstance, LevelData } from "../../utils/LDTK/LDTKJson";
import { Hit } from "../../engine/collision/Hit";
import { HitPoly } from "../../engine/collision/HitPoly";
import { ScaleHelper } from "../../engine/utils/ScaleHelper";

export interface Coordinate {
	cx: number;
	cy: number;
}

export interface FieldInstance {
	__identifier: string;
	__type: string;
	__value: Coordinate[];
}
export class MainBoatScene extends PixiScene {
	public static readonly BUNDLES = ["package-1"];

	private boat: Boat;
	private targetPosition: Array<Point> = [];
	private startPosition: Point;
	private currentTargetIndex: Array<number> = [0, 0, 0, 0];
	private waypointRadius: number;
	private boat1: Boat;
	private boat2: Boat;
	private boat3: Boat;
	private boats: Array<Boat> = [];
	private start: boolean = false;
	private map: LdtkMap;
	private gameContainer: Container = new Container();
	private tilingWaves: TilingSprite;
	private sand: HitPoly;

	constructor() {
		super();

		function parseLDtkJson(raw: any): ILDtkMap {
			return {
				...raw,
				levels: raw.levels.map((level: any) => ({
					...level,
					layerInstances: level.layerInstances?.map((layer: any) => ({
						...layer,
						gridTiles: layer.gridTiles?.map((tile: any) => ({
							...tile,
							px: [tile.px[0] || 0, tile.px[1] || 0] as [number, number],
							src: [tile.src[0] || 0, tile.src[1] || 0] as [number, number],
						})) as TileData[],
						entityInstances: layer.entityInstances?.map((entity: any) => ({
							...entity,
							__grid: [entity.__grid[0] || 0, entity.__grid[1] || 0] as [number, number],
							px: [entity.px[0] || 0, entity.px[1] || 0] as [number, number],
						})) as EntityInstance[],
					})) as LayerInstance[],
				})) as LevelData[],
			};
		}

		const parsedMap: ILDtkMap = parseLDtkJson(rawData);

		this.map = new LdtkMap(parsedMap);

		this.addChild(this.gameContainer);
		this.startPosition = new Point(
			this.map.mapData.levels[0].layerInstances[0].entityInstances[0].__worldX,
			this.map.mapData.levels[0].layerInstances[0].entityInstances[0].__worldY
		);
		this.waypointRadius = 100;

		this.targetPosition = [
			new Point(this.map.mapData.levels[0].layerInstances[0].entityInstances[2].px[0], this.map.mapData.levels[0].layerInstances[0].entityInstances[2].px[1]),
			new Point(
				this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[0].cx * 16,
				this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[0].cy * 16
			),
			new Point(
				this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[1].cx * 16,
				this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[1].cy * 16
			),
			new Point(
				this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[2].cx * 16,
				this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[2].cy * 16
			),
			new Point(
				this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[3].cx * 16,
				this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[3].cy * 16
			),
			new Point(
				this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[4].cx * 16,
				this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[4].cy * 16
			),
		];

		this.targetPosition.forEach((target) => {
			const aux = new Graphics();
			aux.zIndex = 1000;
			aux.beginFill(0xffff00);
			aux.drawCircle(0, 0, 5);
			aux.endFill();
			aux.position.set(target.x, target.y);
			this.map.addChild(aux);
		});

		this.boat = new Boat(100, 2, 2, 100, 500, 1, "ship1");
		this.boat.position.set(this.startPosition.x, this.startPosition.y);

		this.boat1 = new Boat(100, 5, 5, 200, 550, 2, "ship2");
		this.boat1.position.set(this.startPosition.x + 80, this.startPosition.y);

		this.boat2 = new Boat(100, 3, 6, 500, 580, 3, "ship3");
		this.boat2.position.set(this.startPosition.x + 160, this.startPosition.y);

		this.boat3 = new Boat(100, 2, 2, 300, 650, 4, "ship4");
		this.boat3.position.set(this.startPosition.x + 240, this.startPosition.y);

		this.boats.push(this.boat, this.boat1, this.boat2, this.boat3);

		this.tilingWaves = new TilingSprite(Texture.from("waves"), 1280, 720);

		this.sand = HitPoly.makeBox(this.tilingWaves.x, this.tilingWaves.height * 0.25, this.tilingWaves.width, 10);
		this.gameContainer.sortableChildren = true;
		this.gameContainer.addChild(this.tilingWaves, this.map, this.sand, this.boat, this.boat1, this.boat2, this.boat3);

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

				this.boats.forEach((otherBoat) => {
					if (boat !== otherBoat) {
						if (Hit.test(boat.hitbox, otherBoat.hitbox)) {
							const dx = boat.position.x - otherBoat.position.x;
							const dy = boat.position.y - otherBoat.position.y;
							const distance = Math.hypot(dx, dy);

							const repelForce = new Point(dx / distance, dy / distance);

							const repulsionStrength = 1;
							boat.position.x += repelForce.x * repulsionStrength;
							boat.position.y += repelForce.y * repulsionStrength;

							otherBoat.position.x -= repelForce.x * repulsionStrength;
							otherBoat.position.y -= repelForce.y * repulsionStrength;

							boat.currentSpeed *= 0.9;
							otherBoat.currentSpeed *= 0.9;
						}
					}
				});

				const randomRadius = Random.shared.random(this.waypointRadius * 0.5, this.waypointRadius * 1.5);

				if (distanceToTarget < randomRadius) {
					console.log(boat.rotation);
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
