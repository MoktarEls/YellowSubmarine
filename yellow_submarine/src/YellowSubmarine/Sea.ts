import {
    Mesh,
    MeshBuilder,
    PhysicsBody,
    PhysicsMotionType,
    PhysicsShape,
    PhysicsShapeType,
    Vector3,
} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {ReflectiveToonWaterMaterial} from "@/YellowSubmarine/shader material/ReflectiveToonWaterMaterial";

export class Sea {

        private static _instance: Sea;
        private _seaMesh: Mesh;
        private _invisiblePlane: Mesh;
        private _invisiblePlaneBody: PhysicsBody;
        private _invisiblePlaneShape: PhysicsShape;

        constructor() {
            Sea._instance = this;
            this._seaMesh = MeshBuilder.CreateGround(
                "waterPlane",
                {
                    width: 2048,
                    height: 2048,
                    subdivisions: 128,
                },
                Game.scene
            );
            this._invisiblePlane = MeshBuilder.CreateGround(
                "collisionPlane",
                {
                    width: 2048,
                    height: 2048,
                    subdivisions: 128,
                },
                Game.scene
            );
            this._invisiblePlane.position = new Vector3(0,-2,0);
            this._invisiblePlaneBody = new PhysicsBody(this._invisiblePlane, PhysicsMotionType.STATIC, false, Game.scene);
            this._invisiblePlaneShape = new PhysicsShape({
                type: PhysicsShapeType.BOX,
                parameters: {
                    mesh: this._invisiblePlane,
                    extents: new Vector3(2048,2,2048),
                }
            }, Game.scene);
            this._invisiblePlaneBody.shape = this._invisiblePlaneShape;
            this._invisiblePlaneBody.setMassProperties({
                mass: 0,
            });
            this._seaMesh.material = ReflectiveToonWaterMaterial.material;

        }


}