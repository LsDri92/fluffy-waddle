import { Container, Graphics, Point } from "pixi.js";

export class Boat extends Container {
    private maxSpeed: number;
    public acce: number;
    public dece: number;
    private velSmoothTime: number;
    public currentSpeed: number;
    
    public boat: Graphics;
    public maxTurnSpeed: number;
    private turnVelocity = { value: 0 };
    private vel = { value: 0 };

    constructor(maxSpeed: number, acceleration: number, deceleration: number, velSmoothTime: number, maxTurnSpeed: number) {
        super();
        this.currentSpeed = 0;
        this.maxSpeed = maxSpeed;
        this.acce = acceleration;
        this.dece = deceleration;
        this.velSmoothTime = velSmoothTime;
        this.maxTurnSpeed = maxTurnSpeed;

        this.boat = new Graphics();
        this.boat.beginFill(0xff00ff, 0.8);
        this.boat.drawRect(0,0,50,20);
        this.boat.endFill();

        this.addChild(this.boat);

    }


    public turnBoat(targetPosition: Point, dt: number): void {
        let pointToTarget  = new Point(targetPosition.x - this.position.x, targetPosition.y - this.position.y );
        let pointDirection = this.normalizeVector(pointToTarget);
        let angleToTarget = Math.atan2(pointDirection.y, pointDirection.x);
        this.rotation = this.smoothDampAngle(this.rotation, angleToTarget, this.turnVelocity, 500, dt);

    }
    


        public moveTowardTarget(targetPosition: Point, deltaTime: number): number {
            this.turnBoat(targetPosition, deltaTime);
        
            const vectorToTarget = new Point(targetPosition.x - this.position.x, targetPosition.y - this.position.y);
            const distanceToTarget = Math.sqrt(vectorToTarget.x ** 2 + vectorToTarget.y ** 2);
        
            const magnitude = Math.sqrt(vectorToTarget.x ** 2 + vectorToTarget.y ** 2);
            if (magnitude > 0) {
                vectorToTarget.x /= magnitude;
                vectorToTarget.y /= magnitude;
            }
        
            const targetSpeed = Math.min(Math.max(distanceToTarget, 0), this.maxSpeed);
            this.currentSpeed = this.smoothDamp(this.currentSpeed, targetSpeed, this.vel, this.velSmoothTime, deltaTime);
        
            this.position.x += Math.cos(this.rotation) * this.currentSpeed * deltaTime;
            this.position.y += Math.sin(this.rotation) * this.currentSpeed * deltaTime;
        
            return this.currentSpeed;
        }
    

    private normalizeVector(point: Point): Point {
        const length = Math.sqrt(point.x * point.x + point.y * point.y);
        if (length !== 0) {
            return new Point(point.x / length, point.y / length);
        }
        return new Point(0, 0); 
    }


    private smoothDampAngle(
        current: number, 
        target: number, 
        currentVelocity: { value: number },
        smoothTime: number, 
        deltaTime: number
    ): number {
        const pi2 = Math.PI * 2;
        
        let deltaAngle = ((target - current + Math.PI) % pi2) - Math.PI;
    
        return this.smoothDamp(current, current + deltaAngle, currentVelocity, smoothTime, deltaTime);
    }
    
    
    private smoothDamp(
        current: number, 
        target: number, 
        velocity: { value: number },
        smoothTime: number, 
        deltaTime: number
    ): number {
        const omega = 2 / smoothTime;
        const x = omega * deltaTime;
        const exp = 1 / (1 + x + 0.48 * x ** 2 + 0.235 * x ** 3);
        const change = current - target;
        const temp = (velocity.value + omega * change) * deltaTime;
        velocity.value = (velocity.value - omega * temp) * exp; 
        return target + (change + temp) * exp;
    }
    
    
    
}