import { Container, BaseTexture, Sprite, Graphics } from "pixi.js";
import type { ILDtkMap, LevelData, LayerInstance } from "./LDTKJson";
import { GetTileTexture } from "./Tileset";

export class LdtkMap extends Container {
	public static readonly BUNDLES = ["package-1"];
	public mapData: ILDtkMap;
	private tilesetTextures: Map<number, BaseTexture> = new Map();
	public waveTiles: Sprite[] = [];

	constructor(mapData: ILDtkMap) {
		super();
		this.mapData = mapData;
		this.loadTilesets();
		this.loadLevels();
	}

	private loadTilesets(): void {
		this.mapData.defs.tilesets.forEach((tileset) => {
			const baseTexture = BaseTexture.from("tilesheet");
			this.tilesetTextures.set(tileset.uid, baseTexture);
		});
	}

	private loadLevels(): void {
		this.mapData.levels.forEach((level) => {
			this.createLevel(level);
		});
	}

	private createLevel(level: LevelData): void {
		const levelContainer = new Container();
		levelContainer.position.set(level.worldX, level.worldY);

		level.layerInstances?.forEach((layer) => {
			if (layer.entityInstances) {
				this.createEntities(levelContainer, layer);
			}
			if (layer.gridTiles) {
				this.createTileLayer(levelContainer, layer);
			}
		});

		this.addChild(levelContainer);
	}

	private createTileLayer(parent: Container, layer: LayerInstance): void {
		if (!layer.__tilesetDefUid) {
			return;
		}
		const baseTexture = this.tilesetTextures.get(layer.__tilesetDefUid);
		if (!baseTexture) {
			return;
		}

		const isWaveLayer = layer.__identifier === "Waves";

		layer.gridTiles?.forEach((tile) => {
			const tileTexture = GetTileTexture(baseTexture, tile.src[0], tile.src[1], layer.__gridSize, layer.__gridSize);
			const tileSprite = new Sprite(tileTexture);
			tileSprite.position.set(tile.px[0], tile.px[1]);

			if (isWaveLayer) {
				this.waveTiles.push(tileSprite);
			} else {
				parent.addChild(tileSprite);
			}
		});
	}

	private createEntities(parent: Container, layer: LayerInstance): void {
		layer.entityInstances?.forEach((entity) => {
			const entitySprite = new Graphics();
			parent.sortableChildren = true;
			entitySprite.zIndex = 1000;
			console.log(entity.__identifier);
			switch (entity.__identifier) {
				case "Start_Point":
					entitySprite.beginFill(0xff0000);
					entitySprite.drawCircle(0, 0, 5);
					entitySprite.endFill();
					entitySprite.position.set(entity.px[0], entity.px[1]);
					break;

				case "EndPoint":
					entitySprite.beginFill(0xffff00);
					entitySprite.drawCircle(0, 0, 5);
					entitySprite.endFill();
					entitySprite.position.set(entity.px[0], entity.px[1]);
					break;

				case "PathPoints":
					entitySprite.beginFill(0xff00ff);
					entitySprite.drawCircle(0, 0, 5);
					entitySprite.endFill();
					entitySprite.position.set(entity.px[0], entity.px[1]);
					break;

				default:
					break;
			}
			parent.addChild(entitySprite);
		});
	}
}
