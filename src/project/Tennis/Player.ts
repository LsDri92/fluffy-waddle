import type { Body } from "matter-js";
import { Bodies, World } from "matter-js";
import { Texture } from "pixi.js";
import { Container, Sprite } from "pixi.js";
import { engine } from "../..";

// Clase que representa a un jugador con atributos RPG
export class Player extends Container {
	private sprite: Sprite;
	private body: Body;
	public health: number;
	public stamina: number;
	private specialMoveReady: boolean;

	constructor(texture: Texture) {
		super();
		this.sprite = Sprite.from(texture);
		this.body = Bodies.rectangle(0, 0, 32, 32);
		this.health = 100;
		this.stamina = 100;
		this.specialMoveReady = false;
	}

	// Método para actualizar la posición del sprite según la física
	public update(): void {
		this.sprite.x = this.body.position.x;
		this.sprite.y = this.body.position.y;
		this.sprite.rotation = this.body.angle;
	}

	// Aquí podrías agregar métodos para acciones especiales, golpes, etc.
	public performSpecialMove(): void {
		if (this.specialMoveReady) {
			// Lógica del golpe especial
			console.log("Golpe especial activado");
			this.specialMoveReady = false;
		}
	}
	public createPlayers(courtContainer: Container, players: Container[]): void {
		// Ejemplo de creación de dos jugadores
		const playerTexture = Texture.WHITE; // Reemplaza con una textura real
		// Crea cuerpos físicos para los jugadores
		const bodyPlayer1 = Bodies.rectangle(200, 600, 50, 100, { restitution: 0.1 });
		const bodyPlayer2 = Bodies.rectangle(824, 600, 50, 100, { restitution: 0.1 });
		World.add(engine.world, [bodyPlayer1, bodyPlayer2]);

		const player1 = new Player(playerTexture);
		const player2 = new Player(playerTexture);

		// Posicionar y estilizar sprites
		player1.sprite.tint = 0xff0000;
		player2.sprite.tint = 0x0000ff;
		player1.sprite.anchor.set(0.5);
		player2.sprite.anchor.set(0.5);
		player1.sprite.width = player1.sprite.height = 50;
		player2.sprite.width = player2.sprite.height = 50;

		courtContainer.addChild(player1.sprite, player2.sprite);
		players.push(player1, player2);
	}
}
