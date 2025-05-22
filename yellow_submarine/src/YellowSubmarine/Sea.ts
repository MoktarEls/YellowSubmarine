import {
    Mesh,
    MeshBuilder,
    PhysicsBody,
    PhysicsMotionType,
    PhysicsShape,
    PhysicsShapeType,
    TransformNode, Vector3
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
                    width: 512,
                    height: 512,
                    subdivisions: 64,
                },
                Game.scene
            );
            this._groundMesh.material = ReflectiveToonWaterMaterial.material;

        }


}