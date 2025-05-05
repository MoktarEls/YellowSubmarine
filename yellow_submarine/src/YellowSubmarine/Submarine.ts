import {Matrix, Mesh, MeshBuilder, Quaternion, Vector3} from "@babylonjs/core";
import {SubmarineCamera} from "@/YellowSubmarine/SubmarineCamera";
import {Game} from "@/YellowSubmarine/Game";


export class Submarine {

    private _mesh: Mesh;
    private _testForwardMesh: Mesh = MeshBuilder.CreateSphere("testForwardMesh");
    private _testUpwardMesh: Mesh = MeshBuilder.CreateSphere("testUpwardMesh");
    private _testRightMesh: Mesh = MeshBuilder.CreateSphere("testRightMesh");

    public get mesh(): Mesh {
        return this._mesh;
    }

    private _submarineCamera: SubmarineCamera;

    //Movement
    private _maxSpeed = 10;
    private _currentVelocity = new Vector3(0, 0, 0);
    private _acceleration = 0.01;

    private _rotationMaxSpeed = 10;
    private _currentRotationSpeed = 0;
    private _rotationAcceleration = 0.01;

    constructor() {
        this._mesh = this.createMesh();
        this._submarineCamera = new SubmarineCamera(this);
        Game.worldScene.onBeforeRenderObservable.add(() => {
            this.update(Game.engine.getDeltaTime() / 1000);
        });
    }

    private createMesh(): Mesh {
        const mesh = MeshBuilder.CreateBox("player", {width: 2, depth: 4}, Game.worldScene);
        mesh.position = new Vector3(0, 0, 0);
        return mesh;
    }

    private update(deltaTimeInSec: number) {

        const wantedForward = this._submarineCamera.camera.getDirection(Vector3.Forward());
        wantedForward.y = 0;
        wantedForward.normalize();
        const wantedUp = Vector3.Up();
        const wantedRight = wantedUp.cross(wantedForward);

        this._testForwardMesh.position = this.mesh.position.add(wantedForward.scale(5));
        this._testUpwardMesh.position = this.mesh.position.add(wantedUp.scale(5));
        this._testRightMesh.position = this.mesh.position.add(wantedRight.scale(5));
        const wantedRotationMatrix = new Matrix();
        Matrix.FromXYZAxesToRef(wantedRight, wantedUp, wantedForward, wantedRotationMatrix);

        const wantedRotation= Quaternion.FromRotationMatrix(wantedRotationMatrix);
        const currentRotation = Quaternion.FromEulerVector(this.mesh.rotation);

        this.mesh.rotationQuaternion = Quaternion.Slerp(currentRotation, wantedRotation, deltaTimeInSec * this._rotationAcceleration);
    }

}