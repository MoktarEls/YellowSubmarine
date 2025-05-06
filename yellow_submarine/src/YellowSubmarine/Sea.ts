import {GroundMesh, MeshBuilder} from "@babylonjs/core";
import {SeaShaderMaterial} from "@/YellowSubmarine/SeaShaderMaterial";
import {World} from "@/YellowSubmarine/World";

export class Sea extends GroundMesh{

    constructor() {
        super("seaGroundMesh");
        this._copySource(
            MeshBuilder.CreateGround("waterPlane", {
                width: 20,
                height: 20,
                subdivisions: 64
            }, World.instance)
        );
        this.material = new SeaShaderMaterial();
    }

}