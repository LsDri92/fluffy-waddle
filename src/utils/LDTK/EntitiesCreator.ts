/**
 * Interfaz que describe las propiedades básicas de una entidad.
 */
export interface IEntities {
	name: string;
	entityId: string;
	layer: string;
	x: number;
	y: number;
	width: number;
	height: number;
	color: number;
	customFields: any;
}

export class Entities implements IEntities {
	public name: string;
	public entityId: string;
	public layer: string;
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	public color: number;
	public customFields: any;

	constructor(id: string, iid: string, layer: string, x: number, y: number, width: number, height: number, color: number, customFields: any) {
		this.name = id;
		this.entityId = iid;
		this.layer = layer;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.customFields = customFields;
	}
}

export function ldtkSimpleJSON(data: any): Entities {
	return new Entities(data.id, data.iid, data.layer, data.x, data.y, data.width, data.height, data.color, data.customFields);
}
