import { Container } from "pixi.js";

type FlexDirection = "row" | "column";
type JustifyContent = "start" | "center" | "end" | "space-between" | "space-around";

export class UIComponent extends Container {
	private direction: FlexDirection;
	private justify: JustifyContent;
	private spacing: number;
	constructor(direction: FlexDirection = "row", justify: JustifyContent = "start", spacing: number = 10) {
		super();

		this.direction = direction;
		this.justify = justify;
		this.spacing = spacing;
	}

	public layout(): void {
		let offset = 0;
		let totalSize = 0;
		const children = this.children as Container[];

		// Calcular el tamaño total de los elementos
		for (const child of children) {
			totalSize += this.direction === "row" ? child.width : child.height;
		}

		totalSize += (children.length - 1) * this.spacing;

		let startOffset = 0;
		if (this.justify === "center") {
			startOffset = -totalSize / 2;
		}
		if (this.justify === "end") {
			startOffset = -totalSize;
		}

		for (const child of children) {
			if (this.direction === "row") {
				child.position.set(startOffset + offset, 0);
				offset += child.width + this.spacing;
			} else {
				child.position.set(0, startOffset + offset);
				offset += child.height + this.spacing;
			}
		}
	}

	public setPosition(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	public setSize(width: number, height: number): void {
		this.width = width;
		this.height = height;
	}
}
