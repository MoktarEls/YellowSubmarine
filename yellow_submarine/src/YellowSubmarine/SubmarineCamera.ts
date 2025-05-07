import {Submarine} from "@/YellowSubmarine/Submarine";
import {
    Angle,
    ArcRotateCamera,
    Scalar,
    Vector3
} from "@babylonjs/core";
import {MouseMovementEventManager} from "@/YellowSubmarine/MouseMovementEventManager";
import {Game} from "@/YellowSubmarine/Game";

export class SubmarineCamera {

    private get arcRotateCamera(): ArcRotateCamera {
        return this._arcRotateCamera;
    }

    private static _instance: SubmarineCamera;
    private _arcRotateCamera: ArcRotateCamera;

    constructor(
        private _submarine: Submarine,
        private _currentWantedAlpha = Angle.FromDegrees(-90).radians(),
        private _currentWantedBeta = Angle.FromDegrees(45).radians(),
        private _currentLowerBetaLimit = Angle.FromDegrees(30).radians(),
        private _currentUpperBetaLimit = Angle.FromDegrees(85).radians(),
        private _wantedRadius = 15,
        private _horizontalSensitivity = 5,
        private _verticalSensitivity = 5,
        private _cameraRotationLerpFactor = 3,
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
        this.followSubmarine();
        this.updateCameraRotation(deltaTimeInSec);
    }

    private followSubmarine() {
        this.arcRotateCamera.target = this._submarine.mesh.position;
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