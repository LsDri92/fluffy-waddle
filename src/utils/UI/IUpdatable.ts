export interface IUpdateable {
	update(_deltaTime: number, _deltaFrame?: number): void;
}
