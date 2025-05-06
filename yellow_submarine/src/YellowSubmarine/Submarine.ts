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
    private _acceleration = 1;
    private _decceleration = 4;

    private _rotationSpeed = Angle.FromDegrees(60).radians();

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
        this.updateMovementSpeed(deltaTimeInSec);
        this.updateRotation(deltaTimeInSec);
        this.updatePosition(deltaTimeInSec);
    }
    
    private updateMovementSpeed(deltaTimeInSec: number) {
        if(this.isMovementInputPressed()){
            this._currentMovementSpeed += deltaTimeInSec * this._acceleration;
        }
        else{
            this._currentMovementSpeed -= deltaTimeInSec * this._decceleration;
        }
        this._currentMovementSpeed = Scalar.Clamp(this._currentMovementSpeed,0,this._movementSpeed);

    }

    private isMovementInputPressed(){
        return this._isForwardPressed || this._isBackwardPressed || this._isRightPressed || this._isLeftPressed;
    }

    private getMovementInputsVector() {
        const movementInputVector = Vector3.Zero();
        if(this._isForwardPressed){
            movementInputVector.addInPlace(Vector3.Forward());
        }
        if(this._isBackwardPressed){
            movementInputVector.addInPlace(Vector3.Backward());
        }
        if(this._isRightPressed){
            movementInputVector.addInPlace(Vector3.Right());
        }
        if(this._isLeftPressed){
            movementInputVector.addInPlace(Vector3.Left());
        }

        if(movementInputVector !== Vector3.Zero()){
            return movementInputVector.normalize();
        }
        return Vector3.Zero();

    }

    private updateRotation(deltaTimeInSec: number) {
        if(!this.isMovementInputPressed()){
            return;
        }
        const currentRotation = this.mesh.absoluteRotationQuaternion;
        const targetRotation = this._submarineCamera.xzRotationQuaternion();
        const inputsInducedRotation = this.calculateRotationFromInputs(this.getMovementInputsVector());
        const finalTargetRotation = targetRotation.multiply(inputsInducedRotation);

        const currentEulerRotation = currentRotation.toEulerAngles();
        const finalTargetEulerRotation = finalTargetRotation.toEulerAngles();
        const nextYRotation = this.stepTowardsAngle(currentEulerRotation.y, finalTargetEulerRotation.y, deltaTimeInSec * this._rotationSpeed);
        this.mesh.rotation.y = nextYRotation;
    }

    private updatePosition(deltaTimeInSec: number) {
        this.mesh.locallyTranslate(Vector3.Forward().scale(deltaTimeInSec * this._currentMovementSpeed));
    }

    private calculateRotationFromInputs(movementInputsVector: Vector3) {
        if(movementInputsVector.length() == 0){
            return Quaternion.Identity();
        }

        const angle = Math.atan2(movementInputsVector.x, movementInputsVector.z);
        return Quaternion.FromEulerAngles(0, angle,0);


    }

    private stepTowardsAngle(current: number, target: number, maxStep: number): number {
        const PI = Math.PI;
        const TWO_PI = 2 * PI;

        // Calcule la différence dans l'intervalle [-PI, PI]
        let delta = target - current;
        if (delta > PI) delta -= TWO_PI;
        if (delta < -PI) delta += TWO_PI;

        // Limite le déplacement au pas maximal
        const step = Math.abs(delta) < maxStep ? delta : Math.sign(delta) * maxStep;

        // Retourne l'angle avancé
        let result = current + step;

        // Remet dans [-PI, PI]
        if (result > PI) result -= TWO_PI;
        if (result < -PI) result += TWO_PI;

        return result;
    }
}