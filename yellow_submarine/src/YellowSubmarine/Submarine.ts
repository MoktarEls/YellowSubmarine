import {ActionManager, Angle, ExecuteCodeAction, Mesh, MeshBuilder, Quaternion, Scalar, Vector3} from "@babylonjs/core";
import {SubmarineCamera} from "@/YellowSubmarine/SubmarineCamera";
import {Game} from "@/YellowSubmarine/Game";
import {World} from "@/YellowSubmarine/World"

export class Submarine {

    private readonly _mesh: Mesh;
    private _testMesh = MeshBuilder.CreateSphere("testMesh");

    private _isForwardPressed = false;
    private _isBackwardPressed = false;
    private _isRightPressed = false;
    private _isLeftPressed = false;

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
        World.scene.onBeforeRenderObservable.add(() => {
            this.update(Game.engine.getDeltaTime() / 1000);
        });
        World.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (actionEvent) => {
                if(actionEvent.sourceEvent.key === "z"){
                    this._isForwardPressed = true;
                }
                if(actionEvent.sourceEvent.key === "s"){
                    this._isBackwardPressed = true;
                }
                if(actionEvent.sourceEvent.key === "q"){
                    this._isLeftPressed = true;
                }
                if(actionEvent.sourceEvent.key === "d"){
                    this._isRightPressed = true;
                }
            })
        )
        World.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (actionEvent) => {
                if(actionEvent.sourceEvent.key === "z"){
                    this._isForwardPressed = false;
                }
                if(actionEvent.sourceEvent.key === "s"){
                    this._isBackwardPressed = false;
                }
                if(actionEvent.sourceEvent.key === "q"){
                    this._isLeftPressed = false;
                }
                if(actionEvent.sourceEvent.key === "d"){
                    this._isRightPressed = false;
                }
            })
        )
    }

    private createMesh(): Mesh {
        const mesh = MeshBuilder.CreateBox("player", {width: 2, depth: 4}, World.scene);
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

        if(this._isRightPressed){
            rotationSpeedTarget += this._rotationSpeed;
        }
        if(this._isLeftPressed){
            rotationSpeedTarget -= this._rotationSpeed;
        }

        this._currentRotationSpeed = Scalar.MoveTowards(this._currentRotationSpeed, rotationSpeedTarget, deltaTimeInSec * this._rotationAcceleration);
    }

    private updateMovementSpeed(deltaTimeInSec: number) {
        let targetMovementSpeed = 0;
        if(this._isForwardPressed){
            targetMovementSpeed += this._movementSpeed;
        }
        if(this._isBackwardPressed){
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


}