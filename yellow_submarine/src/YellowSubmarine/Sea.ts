    import {Color3, Mesh, MeshBuilder, Scene, Texture, Vector2, Vector3} from "@babylonjs/core";
    import {WaterMaterial} from "@babylonjs/materials";
    //import {ToonWaterAndProbeMaterial} from "@/YellowSubmarine/shader material/ToonWaterAndProbeMaterial";
    import {World} from "@/YellowSubmarine/World";
    import {ToonWaterAndProbeMaterial} from "@/YellowSubmarine/shader material/ToonWaterAndProbeMaterial";
    import {ToonWaterMaterial} from "@/YellowSubmarine/shader material/ToonWaterMaterial";

    export class Sea {

        private static _instance: Sea;
        private _groundMesh: Mesh;

        constructor(private _scene: Scene) {
            Sea._instance = this;
            this._groundMesh = MeshBuilder.CreateGround(
                "waterPlane",
                {
                    width: 512,
                    height: 512,
                    subdivisions: 64,
                },
                this._scene
            );
            this._groundMesh.material = ToonWaterAndProbeMaterial.material;
        }

    }