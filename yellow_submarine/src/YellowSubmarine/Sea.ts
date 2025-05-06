import {GroundMesh, MeshBuilder} from "@babylonjs/core";
import {WorldOld} from "@/YellowSubmarine/WorldOld";
import {SeaShaderMaterial} from "@/YellowSubmarine/SeaShaderMaterial";

export class Sea extends GroundMesh{

    constructor() {
        super("seaGroundMesh");
        this._copySource(
            MeshBuilder.CreateGround("waterPlane", {
                width: 20,
                height: 20,
                subdivisions: 64
            }, WorldOld.scene)
        );
        this.material = new SeaShaderMaterial();
    }

}