import { Sprite } from "pixi.js";
import { Container } from "pixi.js";
import { PixiScene } from "../../engine/scenemanager/scenes/PixiScene";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { ScaleHelper } from "../../engine/utils/ScaleHelper";
import Random from "../../engine/random/Random";
import { Timer } from "../../engine/tweens/Timer";
import { SimpleButton } from "../../engine/ui/button/SimpleButton";
import { Tween } from "tweedle.js";

export class GameScene extends PixiScene {
	public static readonly BUNDLES = ["package-1"];
	private gameContainer: Container = new Container();
	private background: Sprite;
	private player: Player;
	private enemies: Array<Enemy> = [];
	private backgroundContainer: Container = new Container();
	private gameStart: boolean;
	constructor() {
		super();
		this.gameStart = false;
		this.addChild(this.backgroundContainer);
		const bgWidth: number = 1920;
		const bgHeigth: number = 1080;
		this.background = Sprite.from("img/big_placeholder/gardenBg.png");
		this.background.anchor.set(0.5);
		this.background.width = bgWidth;
		this.background.height = bgHeigth;

		this.player = new Player("img/big_placeholder/player.png");
		this.player.position.set(-500, this.background.toLocal(this.gameContainer).y);

		this.background.on("pointertap", () => {
			console.log("background");
			this.player.position.y = this.background.y + 300;
		});
		this.backgroundContainer.addChild(this.background, this.gameContainer);

		this.gameContainer.addChild(this.player);

		const spawnEnemyPositions = [this.background.y + 250];
		let i = 0;
		this.eventMode = "dynamic";

		new Timer()
			.to(500)
			.start()
			.onComplete(() => {
				this.emit("createnewenemy");
			});
		this.on("createnewenemy", () => {
			console.log("created");
			if (i < 10) {
				const enemy = new Enemy();
				enemy.position.set(2000, Random.shared.pickOne(spawnEnemyPositions, 0, 2) + enemy.height * 0.5);
				this.enemies.push(enemy);
				this.gameContainer.addChild(enemy);
				new Timer()
					.to(4000)
					.start()
					.onComplete(() => {
						i++;
						this.emit("createnewenemy");
					});
			}
		});
		this.homeAnimation();
	}
	public override update(_dt: number): void {
		if (!this.gameStart) {
			return;
		}
		this.enemies.forEach((element) => {
			element.update(_dt);
		});
	}

	public override onResize(_newW: number, _newH: number): void {
		ScaleHelper.setScaleRelativeToIdeal(this.backgroundContainer, _newW, _newH, 1920, 1080, ScaleHelper.FILL);
		this.backgroundContainer.x = _newW / 2;
		this.backgroundContainer.y = _newH / 2;
	}

	private homeAnimation(): void {
		const gameTitle = Sprite.from("img/big_placeholder/gardenProps/gameTitle.png");
		gameTitle.anchor.set(0.5);
		gameTitle.position.y = -1000;

		const playButton = new SimpleButton(
			"img/big_placeholder/gardenProps/playButton.png",
			() => {
				this.gameStart = true;
			},
			true
		);
		playButton.scale.set(0.4);
		playButton.alpha = 0;
		playButton.position.y = 100;
		this.gameContainer.addChild(gameTitle, playButton);

		new Tween(gameTitle)
			.to({ y: -250 }, 1500)
			.start()
			.chain(new Tween(playButton).to({ alpha: 1 }, 500));
	}

	public startGameAnimation(): void {}
}
