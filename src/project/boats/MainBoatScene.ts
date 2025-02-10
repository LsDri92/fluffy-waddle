import { Point } from "pixi.js";
import { PixiScene } from "../../engine/scenemanager/scenes/PixiScene";
import { Boat } from "./Boat";


export class MainBoatScene extends PixiScene {
	public static readonly BUNDLES = ["package-1"];

	private boat: Boat;
	private targetPosition: Array<Point> = [];
	private startPosition: Point;
	private currentTargetIndex = 0;
	private waypointRadius: number;
	private boat1: Boat;
	private boat2: Boat;
	private boat3: Boat;
	private boats: Array<Boat> = [];

	constructor() {
		super();
		this.startPosition = new Point(25, 25);
		this.waypointRadius = 50;
		this.targetPosition = [new Point(500, 500), new Point(850, 500), new Point(850, 100), new Point(0, 0)];
		
		this.boat = new Boat(0.1, 0.01, 0.05, 1, 10);
		this.boat.position.set(this.startPosition.x, this.startPosition.y);

		this.boat1 = new Boat(0.3, 0.02, 0.03, 1, 15);
		this.boat1.position.set(this.startPosition.x + 50, this.startPosition.y + 50);

		this.boat2 = new Boat(0.5, 0.03, 0.05, 1, 5);
		this.boat2.position.set(this.startPosition.x + 100, this.startPosition.y + 100);

		this.boat3 = new Boat(0.1, 0.02, 0.03, 1, 20);
		this.boat3.position.set(this.startPosition.x + 150, this.startPosition.y + 150);
		
		this.boats.push(this.boat, this.boat1, this.boat2, this.boat3)
		this.addChild(this.boat, this.boat1, this.boat2, this.boat3);
	}

	public override update(_dt: number): void {
		this.boats.forEach(boat => {
			
			boat.moveTowardTarget(this.targetPosition[this.currentTargetIndex], _dt);
			const targetPosition = this.targetPosition[this.currentTargetIndex];
	
			const distanceToTarget = Math.hypot(targetPosition.x - boat.position.x, targetPosition.y - boat.position.y);
	
			if (distanceToTarget > 200) {
				boat.currentSpeed += boat.acce * _dt;
			} else if (distanceToTarget < 200) {
				boat.currentSpeed -= boat.dece * _dt;
			}
	
			const randomRadius = Math.random() * (this.waypointRadius - this.waypointRadius * 0.5) + this.waypointRadius * 0.5;
			console.log(boat.currentSpeed);
			if (distanceToTarget < randomRadius) {
				this.goToNextTarget();
			}
		});
	}

	private goToNextTarget(): void {
		this.currentTargetIndex = (this.currentTargetIndex + 1) % this.targetPosition.length;
		console.log("Waypoint cambiado a:", this.currentTargetIndex);
	}
}
