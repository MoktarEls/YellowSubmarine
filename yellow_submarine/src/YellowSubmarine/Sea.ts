import {Mesh, MeshBuilder, Scene} from "@babylonjs/core";
import {SeaShaderMaterial} from "@/YellowSubmarine/shader material/SeaShaderMaterial";
import {World} from "@/YellowSubmarine/World";

export class Sea {

    private static _instance: Sea;
    private _groundMesh: Mesh;

    constructor(private _world: World) {
        this._groundMesh = new Mesh("");
    }

    public init(): void {
        this._groundMesh = MeshBuilder.CreateGround(
            "waterPlane",
            {
                width: 20,
                height: 20,
                subdivisions: 64
            },
            this._world.scene
        );
        this._groundMesh.material = new SeaShaderMaterial().shaderMaterial;
    }

}