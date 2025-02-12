export interface ILDtkMap {
	__header__: LDtkHeader;
	iid: string;
	jsonVersion: string;
	appBuildId: number;
	nextUid: number;
	identifierStyle: string;
	toc: TableOfContents[];
	worldLayout: string;
	worldGridWidth: number;
	worldGridHeight: number;
	defaultLevelWidth: number;
	defaultLevelHeight: number;
	defaultPivotX: number;
	defaultPivotY: number;
	defaultGridSize: number;
	defaultEntityWidth: number;
	defaultEntityHeight: number;
	bgColor: string;
	defaultLevelBgColor: string;
	minifyJson: boolean;
	externalLevels: boolean;
	exportTiled: boolean;
	simplifiedExport: boolean;
	imageExportMode: string;
	exportLevelBg: boolean;
	pngFilePattern?: string;
	levelNamePattern: string;
	defs: Definitions;
	levels: LevelData[];
}

export interface LDtkHeader {
	fileType: string;
	app: string;
	doc: string;
	schema: string;
	appAuthor: string;
	appVersion: string;
	url: string;
}

export interface TableOfContents {
	identifier: string;
	instances: any[];
	instancesData: InstanceData[];
}

export interface InstanceData {
	iids: InstanceIdentifiers;
	worldX: number;
	worldY: number;
	widPx: number;
	heiPx: number;
	fields: Record<string, any>;
}

export interface InstanceIdentifiers {
	worldIid: string;
	levelIid: string;
	layerIid: string;
	entityIid: string;
}

export interface Definitions {
	layers: LayerDefinition[];
	entities: EntityDefinition[];
	tilesets: Tileset[];
}

export interface LayerDefinition {
	__type: string;
	identifier: string;
	type: string;
	uid: number;
	gridSize: number;
	tilesetDefUid?: number;
	tilesetRelPath?: string;
}

export interface EntityDefinition {
	identifier: string;
	uid: number;
	width: number;
	height: number;
	color: string;
	renderMode: string;
	showName: boolean;
	fieldDefs: FieldDefinition[];
}

export interface FieldDefinition {
	identifier: string;
	__type: string;
	uid: number;
	type: string;
	isArray: boolean;
	editorDisplayMode: string;
}

export interface Tileset {
	__cWid: number;
	__cHei: number;
	identifier: string;
	uid: number;
	relPath: string;
	pxWid: number;
	pxHei: number;
	tileGridSize: number;
}

export interface LevelData {
	identifier: string;
	iid: string;
	uid: number;
	worldX: number;
	worldY: number;
	pxWid: number;
	pxHei: number;
	bgColor?: string;
	layerInstances: LayerInstance[];
}

export interface LayerInstance {
	__identifier: string;
	__type: string;
	__gridSize: number;
	__tilesetDefUid?: number;
	__tilesetRelPath?: string;
	iid: string;
	gridTiles?: TileData[];
	entityInstances?: EntityInstance[];
}

export interface TileData {
	px: [number, number];
	src: [number, number];
	f: number;
	t: number;
	d: number[];
	a: number;
}

export interface EntityInstance {
	__identifier: string;
	__grid: [number, number];
	__pivot: [number, number];
	__tags: string[];
	__tile?: any;
	iid: string;
	width: number;
	height: number;
	px: [number, number];
	fieldInstances: FieldInstance[];
	__worldX: number;
	__worldY: number;
}

export interface FieldInstance {
	__identifier: string;
	__type: string;
	__value: any;
}
