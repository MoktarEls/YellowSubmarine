import {AbstractMesh, Vector3} from "@babylonjs/core";

export class FishEntity {
    private _mesh!: AbstractMesh;
    private _velocity: Vector3;

    constructor() {
        this._velocity = Vector3.Zero();
    }

    public get mesh(): AbstractMesh {
        return this._mesh;
    }

    public set mesh(value: AbstractMesh) {
        this._mesh = value;
    }

    public get velocity(): Vector3 {
        return this._velocity;
    }

    public set velocity(value: Vector3) {
        this._velocity = value;
    }
}