    import {Mesh, MeshBuilder} from "@babylonjs/core";
    import {ToonWaterAndProbeMaterial} from "@/YellowSubmarine/shader material/ToonWaterAndProbeMaterial";
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
                    width: 1,
                    height: 1,
                    subdivisions: 64,
                },
                Game.scene
            );
            this._groundMesh.material = ReflectiveToonWaterMaterial.material;
        }

    }