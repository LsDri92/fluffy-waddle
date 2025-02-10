import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import type { BaseTexture } from "@pixi/core";
import { Rectangle, Texture } from "@pixi/core";
import { GetTileTexture } from "./Tileset";

export class Map extends Container {
	public identifier: string;
	public iid: string;
	public worldX: number;
	public worldY: number;
	public bgColor: string;
	public layerInstances: any[] = [];
	private jsonData: any;
	private tiles: Array<Sprite> = [];
	constructor(jsonData: any) {
		super();

		this.identifier = jsonData.identifier;
		this.iid = jsonData.iid;
		this.worldX = jsonData.worldX;
		this.worldY = jsonData.worldY;
		this.bgColor = jsonData.bgColor;
		this.layerInstances = jsonData.layerInstances[1];
		console.log(jsonData.layerInstances);
		this.jsonData = jsonData;
	}

	public cutTileset(baseTexture: BaseTexture): void {
		const numTilesX = Math.floor(baseTexture.width / 16);
		const numTilesY = Math.floor(baseTexture.height / 16);

		for (let y = 0; y < numTilesY; y++) {
			for (let x = 0; x < numTilesX; x++) {
				const tile = Sprite.from(new Texture(baseTexture, new Rectangle(x * 16, y * 16, 16, 16)));

				tile.x = x * 16;
				tile.y = y * 16;

				this.addChild(tile);
				this.tiles.push(tile);
			}
		}
	}

	public makeMap(baseTexture: BaseTexture, tilesize: number): void {
		const tileSize = tilesize;
		for (let l = this.jsonData.layerInstances.length - 1; l > 0; l--) {
			for (let i = 0; i < this.jsonData.layerInstances[l].autoLayerTiles.length; i++) {
				const tileTexture = GetTileTexture(
					baseTexture,
					this.jsonData.layerInstances[l].autoLayerTiles[i].src[0],
					this.jsonData.layerInstances[l].autoLayerTiles[i].src[1],
					tileSize,
					tileSize
				);

				const tile = Sprite.from(tileTexture);
				tile.x = this.jsonData.layerInstances[l].autoLayerTiles[i].px[0];
				tile.y = this.jsonData.layerInstances[l].autoLayerTiles[i].px[1];
				this.addChild(tile);
			}
		}
	}
	public makeProps(baseTexture: BaseTexture, tilesize: number, index: number): void {
		const tileSize = tilesize;

		for (let i = 0; i < this.jsonData.layerInstances[index].gridTiles.length; i++) {
			const tileTexture = GetTileTexture(
				baseTexture,
				this.jsonData.layerInstances[index].gridTiles[i].src[0],
				this.jsonData.layerInstances[index].gridTiles[i].src[1],
				tileSize,
				tileSize
			);

			const tile = Sprite.from(tileTexture);
			tile.x = this.jsonData.layerInstances[index].gridTiles[i].px[0];
			tile.y = this.jsonData.layerInstances[index].gridTiles[i].px[1];
			this.addChild(tile);
		}
	}
}
