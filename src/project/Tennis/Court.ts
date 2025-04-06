import { Bodies, World } from "matter-js";
import { Container } from "pixi.js";
import { engine } from "../..";

export class Court extends Container {
	constructor() {
		super();
		this.createCourt();
	}

	public createCourt(): void {
		// Ejemplo: crear límites de la cancha usando cuerpos estáticos
		const ground = Bodies.rectangle(512, 768, 1024, 20, { isStatic: true });
		const leftWall = Bodies.rectangle(0, 384, 20, 768, { isStatic: true });
		const rightWall = Bodies.rectangle(1024, 384, 20, 768, { isStatic: true });
		const ceiling = Bodies.rectangle(512, 0, 1024, 20, { isStatic: true });

		World.add(engine.world, [ground, leftWall, rightWall, ceiling]);

		// Aquí podrías agregar líneas de la red y otros detalles visuales en PixiJS
	}
}
