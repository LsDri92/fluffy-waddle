import { Point, Graphics, Container } from "pixi.js";

export class RaycastUtils {
    static castRay(
        start: Point, 
        direction: Point, 
        maxDistance: number, 
        obstacles: Container[]
    ): { hit: boolean; hitPoint?: Point; hitObject?: Container } {
        
        let closestHit: Point | undefined = undefined;
        let closestObject: Container | undefined = undefined;
        let minDist = maxDistance;

        // Normalizar la dirección
        const length = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        if (length === 0) return { hit: false };
        direction.x /= length;
        direction.y /= length;

        for (let obj of obstacles) {
            const bounds = obj.getBounds();

            const hitPoint = RaycastUtils.lineIntersectsRect(start, direction, maxDistance, bounds);

            if (hitPoint) {
                const dist = Math.sqrt((hitPoint.x - start.x) ** 2 + (hitPoint.y - start.y) ** 2);
                if (dist < minDist) {
                    minDist = dist;
                    closestHit = hitPoint;
                    closestObject = obj;
                }
            }
        }

        return { hit: closestHit !== undefined, hitPoint: closestHit, hitObject: closestObject };
    }

    private static lineIntersectsRect(start: Point, direction: Point, maxDistance: number, rect: { x: number, y: number, width: number, height: number }): Point | undefined {
        const end = new Point(start.x + direction.x * maxDistance, start.y + direction.y * maxDistance);
        
        // Lados del rectángulo
        const edges = [
            { p1: new Point(rect.x, rect.y), p2: new Point(rect.x + rect.width, rect.y) },  // Arriba
            { p1: new Point(rect.x, rect.y + rect.height), p2: new Point(rect.x + rect.width, rect.y + rect.height) }, // Abajo
            { p1: new Point(rect.x, rect.y), p2: new Point(rect.x, rect.y + rect.height) },  // Izquierda
            { p1: new Point(rect.x + rect.width, rect.y), p2: new Point(rect.x + rect.width, rect.y + rect.height) }  // Derecha
        ];

        let closestPoint: Point | undefined = undefined;
        let minDist = maxDistance;

        for (let edge of edges) {
            const intersection = RaycastUtils.lineIntersection(start, end, edge.p1, edge.p2);
            if (intersection) {
                const dist = Math.sqrt((intersection.x - start.x) ** 2 + (intersection.y - start.y) ** 2);
                if (dist < minDist) {
                    minDist = dist;
                    closestPoint = intersection;
                }
            }
        }

        return closestPoint;
    }

    private static lineIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point | undefined {
        const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
        if (denom === 0) return undefined; // Líneas paralelas

        const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
        const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / denom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return new Point(p1.x + t * (p2.x - p1.x), p1.y + t * (p2.y - p1.y));
        }
        return undefined;
    }

    static drawRay(start: Point, direction: Point, maxDistance: number, graphics: Graphics): void {
        graphics.clear();
        graphics.lineStyle(2, 0xff0000);
        graphics.moveTo(start.x, start.y);
        graphics.lineTo(start.x + direction.x * maxDistance, start.y + direction.y * maxDistance);
    }
}
