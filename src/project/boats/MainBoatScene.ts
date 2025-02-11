import { Point } from "pixi.js";
import { PixiScene } from "../../engine/scenemanager/scenes/PixiScene";
import { Boat } from "./Boat";
import { Timer } from "../../engine/tweens/Timer";
import Random from "../../engine/random/Random";

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


	constructor() {
		super();
		this.startPosition = new Point(25, 25);
		this.waypointRadius = 60;
		this.targetPosition = [new Point(1200, 100), new Point(1200, 550), new Point(100, 600), new Point(100, 100)];

		this.boat = new Boat(140, 70, 40, 30, 100, 1);
		this.boat.position.set(this.startPosition.x, this.startPosition.y);

		this.boat1 = new Boat(150, 50, 2000, 25, 250, 2);
		this.boat1.position.set(this.startPosition.x + 50, this.startPosition.y + 50);

		this.boat2 = new Boat(130, 30, 60, 100, 75, 3);
		this.boat2.position.set(this.startPosition.x + 100, this.startPosition.y + 100);

		this.boat3 = new Boat(150, 25, 25, 20, 45, 4);
		this.boat3.position.set(this.startPosition.x + 150, this.startPosition.y + 150);

		this.boats.push(this.boat, this.boat1, this.boat2, this.boat3);
		this.addChild(this.boat, this.boat1, this.boat2, this.boat3);

		const countdown = new Timer();
		countdown.to(3500).start().onComplete(()=>{
			this.start = true;
		});
	}

	public override update(_dt: number): void {
		if (this.start){

			this.boats.forEach((boat, index) => {
				boat.moveTowardTarget(this.targetPosition[this.currentTargetIndex[index]], _dt);
				const targetPosition = this.targetPosition[this.currentTargetIndex[index]];
	
				const distanceToTarget = Math.hypot(targetPosition.x - boat.position.x, targetPosition.y - boat.position.y);
	
				console.log(distanceToTarget);
				if (distanceToTarget > 500) {
					boat.currentSpeed += boat.acce * _dt / 60;
				} else if (distanceToTarget < 500) {
					boat.currentSpeed -= boat.dece * _dt / 60;
				}
	
				const randomRadius = Random.shared.random(this.waypointRadius * 0.5, this.waypointRadius * 1.5 );
	
				if (distanceToTarget < randomRadius) {
					this.goToNextTarget(index);
				}
			});
		}
	}

	private goToNextTarget(index: number): void {
		this.currentTargetIndex[index] = (this.currentTargetIndex[index] + 1) % this.targetPosition.length;
		console.log("Waypoint cambiado a:", this.currentTargetIndex);
	}
}
