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
                    width: 2048,
                    height: 2048,
                    subdivisions: 128,
                },
                Game.scene
            );
            this._groundMesh.material = ReflectiveToonWaterMaterial.material;

        }


}