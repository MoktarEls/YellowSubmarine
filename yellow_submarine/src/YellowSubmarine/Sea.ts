    import {Mesh, MeshBuilder} from "@babylonjs/core";
    import {ToonWaterAndProbeMaterial} from "@/YellowSubmarine/shader material/ToonWaterAndProbeMaterial";
    import {Game} from "@/YellowSubmarine/Game";

    export class Sea {

        private static _instance: Sea;
        private _groundMesh: Mesh;

        constructor() {
            Sea._instance = this;
            this._groundMesh = MeshBuilder.CreateGround(
                "waterPlane",
                {
                    width: 512,
                    height: 512,
                    subdivisions: 64,
                },
                Game.scene
            );
            this._groundMesh.material = ToonWaterAndProbeMaterial.material;
        }

    }