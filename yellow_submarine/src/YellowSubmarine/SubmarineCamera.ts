import {Submarine} from "@/YellowSubmarine/Submarine";
import {Angle, ArcRotateCamera, Camera, Quaternion, Scalar, Vector3} from "@babylonjs/core";
import {MouseMovementEventManager} from "@/YellowSubmarine/event managers/MouseMovementEventManager";
import {Game} from "@/YellowSubmarine/Game";

export class SubmarineCamera {

    public get camera(): Camera {
        return this.arcRotateCamera;
    }

    private get arcRotateCamera(): ArcRotateCamera {
        return this._arcRotateCamera;
    }

    private static _instance: SubmarineCamera;
    private _arcRotateCamera: ArcRotateCamera;

    private _currentTargetPosition: Vector3 = Vector3.Zero();
    private _lerpFactor = 2;
    private _distanceThreshold = 0.1;
    private _localOffset = new Vector3(0, 2, 0);

    constructor(
        private _submarine: Submarine,
        private _currentWantedAlpha = Angle.FromDegrees(-90).radians(),
        private _currentWantedBeta = Angle.FromDegrees(45).radians(),
        private _currentLowerBetaLimit = Angle.FromDegrees(30).radians(),
        private _currentUpperBetaLimit = Angle.FromDegrees(85).radians(),
        private _wantedRadius = 25,
        private _horizontalSensitivity = 5,
        private _verticalSensitivity = 5,
        private _cameraRotationLerpFactor = 20,
    ) {
        this._arcRotateCamera = new ArcRotateCamera("submarineCamera", _currentWantedAlpha, Angle.FromDegrees(_currentWantedBeta).radians(), _wantedRadius, Vector3.Zero());
        SubmarineCamera._instance = this;
        this.setWantedRadius(this._wantedRadius);
        this.setWantedAlpha(this._currentWantedAlpha);
        this.setWantedBeta(this._currentWantedBeta);
    }

    public init() {
        this._submarine.mesh.getScene().addCamera(this._arcRotateCamera);

        this.enableCameraRotation();
        this.registerUpdate();
        return;
    }

    private getCameraRotation(): Quaternion{
        const forwardAxis = this._arcRotateCamera.getFrontPosition(1);
        forwardAxis.y = 0;
        forwardAxis.normalize();

        return Quaternion.FromLookDirectionLH(forwardAxis, Vector3.Up());
    }

    private enableCameraRotation() {
        MouseMovementEventManager.registerMouseMovement((deltaX, deltaY) => {
            this._currentWantedAlpha = Scalar.LerpAngle(this._currentWantedAlpha, this._currentWantedAlpha - deltaX * this._horizontalSensitivity, 1);
            this._currentWantedBeta = Scalar.LerpAngle(this._currentWantedBeta, this._currentWantedBeta - deltaY * this._verticalSensitivity, 1);
            this._currentWantedBeta = Scalar.Clamp(this._currentWantedBeta, this._currentLowerBetaLimit, this._currentUpperBetaLimit);
        })
    }


    private registerUpdate() {
        Game.registerUpdateAction(this.updateSubmarineCamera, this);
    }

    private updateSubmarineCamera(deltaTimeInSec: number) {
        this.updateCurrentTargetPosition(deltaTimeInSec);
        this.followSubmarine();
        this.updateCameraRotation(deltaTimeInSec);
    }

    private updateCurrentTargetPosition(deltaTimeInSec: number) {
        if(Vector3.Distance(this.arcRotateCamera.target, this.getFinalTargetPosition()) >= this._distanceThreshold){
            this._currentTargetPosition = Vector3.Lerp(this.arcRotateCamera.target, this.getFinalTargetPosition(), deltaTimeInSec * this._lerpFactor);
        }
    }

    private getFinalTargetPosition(){
        const submarinePosition = this._submarine.mesh.position;
        return submarinePosition.add(this._localOffset.rotateByQuaternionAroundPointToRef(this.getCameraRotation(), Vector3.Zero(), Vector3.Zero()));
    }

    private followSubmarine() {
        this.arcRotateCamera.target = this._currentTargetPosition;
    }

    private updateCameraRotation(deltaTimeInSec: number) {
        const nextAlpha = Scalar.LerpAngle(this.arcRotateCamera.alpha, this._currentWantedAlpha, deltaTimeInSec * this._cameraRotationLerpFactor);
        const nextBeta = Scalar.LerpAngle(this.arcRotateCamera.beta, this._currentWantedBeta, deltaTimeInSec * this._cameraRotationLerpFactor);
        this.setWantedAlpha(nextAlpha);
        this.setWantedBeta(nextBeta);

    }

    private setWantedRadius(radius: number) {
        this.arcRotateCamera.radius = radius;
        this.arcRotateCamera.lowerRadiusLimit = radius;
        this.arcRotateCamera.upperRadiusLimit = radius;
    }

    private setWantedAlpha(alpha: number) {
        this.arcRotateCamera.alpha = alpha;
        this.arcRotateCamera.lowerAlphaLimit = alpha;
        this.arcRotateCamera.upperAlphaLimit = alpha;
    }

    private setWantedBeta(beta: number) {
        beta = Scalar.Clamp(beta, this._currentLowerBetaLimit, this._currentUpperBetaLimit);
        this.arcRotateCamera.beta = beta;
        this.arcRotateCamera.lowerBetaLimit = beta;
        this.arcRotateCamera.upperBetaLimit = beta;
    }

}