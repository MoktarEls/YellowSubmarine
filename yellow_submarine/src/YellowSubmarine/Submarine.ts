import {Angle, Mesh, MeshBuilder, Scalar, Vector3} from "@babylonjs/core";
import {SubmarineCamera} from "@/YellowSubmarine/SubmarineCamera";
import {KeyboardEventManager} from "@/YellowSubmarine/KeyboardEventManager";
import {Game} from "@/YellowSubmarine/Game";
import {World} from "@/YellowSubmarine/World";

export class Submarine {
    private readonly _mesh: Mesh;
    private _testMesh = MeshBuilder.CreateSphere("testMesh");

    private _movementSpeed = 5;
    private _currentMovementSpeed = 0;
    private _acceleration = 3;

    private _rotationSpeed = Angle.FromDegrees(60).radians();
    private _currentRotationSpeed = 0;
    private _rotationAcceleration = Angle.FromDegrees(45).radians();

    public get mesh(): Mesh {
        return this._mesh;
    }

    private _submarineCamera: SubmarineCamera;

    constructor() {
        this._mesh = this.createMesh();
        this._submarineCamera = new SubmarineCamera(this);
        Game.registerUpdateAction(this.update, this);
    }

    private createMesh(): Mesh {
        const mesh = MeshBuilder.CreateBox("player", {width: 2, depth: 4}, World.instance);
        mesh.position = new Vector3(0, 0, 0);
        return mesh;
    }

    private update(deltaTimeInSec: number) {
        this._testMesh.position = this.mesh.position.add(this.mesh.forward.scale(3));
        this.updateRotationSpeed(deltaTimeInSec);
        this.updateMovementSpeed(deltaTimeInSec);
        this.updateRotation(deltaTimeInSec);
        this.updatePosition(deltaTimeInSec);
    }

    private updateRotationSpeed(deltaTimeInSec: number) {
        let rotationSpeedTarget = 0;

        if(this.isRightPressed()){
            rotationSpeedTarget += this._rotationSpeed;
        }
        if(this.isLeftPressed()){
            rotationSpeedTarget -= this._rotationSpeed;
        }

        this._currentRotationSpeed = Scalar.MoveTowards(this._currentRotationSpeed, rotationSpeedTarget, deltaTimeInSec * this._rotationAcceleration);
    }

    private updateMovementSpeed(deltaTimeInSec: number) {
        let targetMovementSpeed = 0;
        if(this.isForwardPressed()){
            targetMovementSpeed += this._movementSpeed;
        }
        if(this.isBackwardPressed()){
            targetMovementSpeed -= this._movementSpeed;
        }
        this._currentMovementSpeed = Scalar.MoveTowards(this._currentMovementSpeed, targetMovementSpeed, deltaTimeInSec * this._acceleration);
    }

    private updateRotation(deltaTimeInSec: number) {
        this.mesh.rotation.y = this.mesh.rotation.y + deltaTimeInSec * this._currentRotationSpeed;
    }

    private updatePosition(deltaTimeInSec: number) {
        this.mesh.locallyTranslate(Vector3.Forward().scale(deltaTimeInSec * this._currentMovementSpeed));
    }

    private isForwardPressed() {
        return KeyboardEventManager.isKeyPressed("z");
    }

    private isBackwardPressed() {
        return KeyboardEventManager.isKeyPressed("s");
    }

    private isRightPressed() {
        return KeyboardEventManager.isKeyPressed("d");
    }

    private isLeftPressed() {
        return KeyboardEventManager.isKeyPressed("q");
    }


}