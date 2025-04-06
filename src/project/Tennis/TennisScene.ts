import { Texture } from "pixi.js";
import { PixiScene } from "../../engine/scenemanager/scenes/PixiScene";
import { engine } from "../..";
import { Engine } from "matter-js";
import { Player } from "./Player";
import { Ball } from "./Ball";
import { Court } from "./Court";

// Clase principal del juego
export class TennisRPGGame extends PixiScene {
	private players: Player[] = [];
	private ball: Ball;
	private player: Player;
	private court: Court;

	constructor() {
		super();
		this.player = new Player(Texture.WHITE);
		this.ball = new Ball();
		this.court = new Court();
		// Crear la cancha, la pelota y los jugadores
		this.court.createCourt();
		this.ball.createBall();
		this.player.createPlayers(this, this.players);

		this.addChild(this.court, this.ball, this.player);
	}

	public override update(_dt: number): void {
		// Actualizar el motor de físicas
		Engine.update(engine, _dt * 16.666); // Aproximadamente 60 FPS

		// Sincronizar la posición de la pelota y los jugadores con sus sprites
		this.ball.ball.sprite.x = this.ball.ball.ballBody.position.x;
		this.ball.ball.sprite.y = this.ball.ball.ballBody.position.y;
		this.players.forEach((player) => player.update());

		// Aquí podrías integrar la lógica de tácticas, detección de colisiones para golpes, y entrada del usuario
	}
}
