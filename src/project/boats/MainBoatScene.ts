import { Container, Graphics, Point, Texture, TilingSprite } from "pixi.js";
import { PixiScene } from "../../engine/scenemanager/scenes/PixiScene";
import { Boat } from "./Boat";
import { Timer } from "../../engine/tweens/Timer";
import Random from "../../engine/random/Random";
import { LdtkMap } from "../../utils/LDTK/LdtkMap";
import rawData from "../tracks/track1.json";
import type { ILDtkMap, TileData, EntityInstance, LayerInstance, LevelData } from "../../utils/LDTK/LDTKJson";

export interface Coordinate {
	cx: number;
	cy: number;
}

export interface FieldInstance {
	__identifier: string;
	__type: string;
	__value: Coordinate[]; // Array de coordenadas
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
		console.log(parsedMap);

		this.map = new LdtkMap(parsedMap);

		this.addChild(this.gameContainer);
		this.startPosition = new Point(
			this.map.mapData.levels[0].layerInstances[0].entityInstances[0].__worldX,
			this.map.mapData.levels[0].layerInstances[0].entityInstances[0].__worldY
		);
		this.waypointRadius = 100;

		this.targetPosition = [
			new Point(this.map.mapData.levels[0].layerInstances[0].entityInstances[0].__worldX, this.map.mapData.levels[0].layerInstances[0].entityInstances[0].__worldY),
			new Point(this.map.mapData.levels[0].layerInstances[0].entityInstances[2].px[0], this.map.mapData.levels[0].layerInstances[0].entityInstances[2].px[1]),
			new Point(this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[0].cx * 16, this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[0].cy * 16),
			new Point(this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[1].cx * 16, this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[1].cy * 16),
			new Point(this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[2].cx * 16, this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[2].cy * 16),
			new Point(this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[3].cx * 16, this.map.mapData.levels[0].layerInstances[0].entityInstances[2].fieldInstances[0].__value[3].cy * 16),
		];

		this.targetPosition.forEach((target)=>{
			const aux = new Graphics();
			aux.zIndex = 1000;
			aux.beginFill(0xffff00);
			aux.drawCircle(0,0,5);
			aux.endFill();
			aux.position.set(target.x, target.y);
			this.map.addChild(aux);
		})
		this.boat = new Boat(140, 70, 40, 30, 500, 1, "ship1");
		this.boat.position.set(this.startPosition.x, this.startPosition.y);

		this.boat1 = new Boat(150, 50, 2000, 25, 550, 2, "ship2");
		this.boat1.position.set(this.startPosition.x + 50, this.startPosition.y + 50);

		this.boat2 = new Boat(130, 30, 60, 100, 580, 3, "ship3");
		this.boat2.position.set(this.startPosition.x + 100, this.startPosition.y + 100);

		this.boat3 = new Boat(150, 25, 25, 20, 650, 4, "ship4");
		this.boat3.position.set(this.startPosition.x + 150, this.startPosition.y + 150);

		this.boats.push(this.boat, this.boat1, this.boat2, this.boat3);

		this.tilingWaves = new TilingSprite(Texture.from("waves"), 1280, 720);
		this.gameContainer.sortableChildren = true;
		this.gameContainer.addChild(this.tilingWaves, this.map, this.boat, this.boat1, this.boat2, this.boat3);

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
		// this.tilingWaves.tilePosition.y -= 0.1 * _dt; 
		if (this.start) {
			this.boats.forEach((boat, index) => {
				boat.moveTowardTarget(this.targetPosition[this.currentTargetIndex[index]], _dt);
				const targetPosition = this.targetPosition[this.currentTargetIndex[index]];

				const distanceToTarget = Math.hypot(targetPosition.x - boat.position.x, targetPosition.y - boat.position.y);

				if (distanceToTarget > 500) {
					boat.currentSpeed += (boat.acce * _dt) / 60;
				} else if (distanceToTarget < 500) {
					boat.currentSpeed -= (boat.dece * _dt) / 60;
				}

				const randomRadius = Random.shared.random(this.waypointRadius * 0.5, this.waypointRadius * 1.5);

				if (distanceToTarget < randomRadius) {
					this.goToNextTarget(index);
				}
			});
		}
	}

	private goToNextTarget(index: number): void {
		this.currentTargetIndex[index] = (this.currentTargetIndex[index] + 1) % this.targetPosition.length;
	}
}
