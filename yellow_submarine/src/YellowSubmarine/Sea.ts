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
        private _physicsBody: PhysicsBody;
        private _physicsShape: PhysicsShape;
        private _surfaceLevelTransform: TransformNode;

        constructor() {
            Sea._instance = this;
            this._surfaceLevelTransform = new TransformNode("surfaceLevel");
            this._groundMesh = MeshBuilder.CreateGround(
                "waterPlane",
                {
                    width: 512,
                    height: 512,
                    subdivisions: 64,
                },
                Game.scene
            );
            this._groundMesh.parent = this._surfaceLevelTransform;
            this._groundMesh.material = ReflectiveToonWaterMaterial.material;
            this._physicsBody = new PhysicsBody(this._groundMesh, PhysicsMotionType.STATIC, false, Game.scene);
            this._physicsShape = new PhysicsShape({
                type: PhysicsShapeType.BOX,
                parameters: {
                    center: new Vector3(0,-3.5,0),
                    extents: new Vector3(512,5,512),
                },
            },Game.scene);
            this._physicsBody.shape = this._physicsShape;
        }


    }