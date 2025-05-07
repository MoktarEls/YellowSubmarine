import {Mesh, MeshBuilder, Scene} from "@babylonjs/core";
import {SeaShaderMaterial} from "@/YellowSubmarine/SeaShaderMaterial";

export class Sea {

    private static _instance: Sea;
    private _groundMesh: Mesh;

    constructor(private _worldScene: Scene) {
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
            this._worldScene
        );
        this._groundMesh.material = new SeaShaderMaterial().shaderMaterial;
    }

}