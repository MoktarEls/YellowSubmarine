import {
    Mesh,
    MeshBuilder,
} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {ReflectiveToonWaterMaterial} from "@/YellowSubmarine/shader material/ReflectiveToonWaterMaterial";

export class Sea {

        private static _instance: Sea;
        private _groundMesh: Mesh;

        constructor() {
            Sea._instance = this;
            this._groundMesh = MeshBuilder.CreateGround(
                "waterPlane",
                {
                    width: 1024,
                    height: 1024,
                    subdivisions: 64,
                },
                Game.scene
            );
            this._groundMesh.material = ReflectiveToonWaterMaterial.material;

        }


}