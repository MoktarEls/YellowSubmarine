import {Submarine} from "@/YellowSubmarine/Submarine";
import {
    ActionManager,
    Angle,
    ArcRotateCamera,
    ExecuteCodeAction,
    Scalar,
    Vector3
} from "@babylonjs/core";
import {GameOld} from "@/YellowSubmarine/GameOld";
import {WorldOld} from "@/YellowSubmarine/WorldOld";
import {MouseMovementEventManager} from "@/YellowSubmarine/MouseMovementEventManager";

export class SubmarineCamera extends ArcRotateCamera {


    constructor(
        private _submarine: Submarine,
        private _currentWantedAlpha = Angle.FromDegrees(-90).radians(),
        private _currentWantedBeta = Angle.FromDegrees(45).radians(),
        private _lowerBetaLimit = Angle.FromDegrees(30).radians(),
        private _upperBetaLimit = Angle.FromDegrees(85).radians(),
        private _wantedRadius = 15,
        private _horizontalSensitivity = 5,
        private _verticalSensitivity = 5,
        private _cameraRotationLerpFactor = 3,
    ) {
        super("submarineCamera", _currentWantedAlpha, Angle.FromDegrees(_currentWantedBeta).radians(), _wantedRadius, Vector3.Zero());

        this.setWantedRadius(_wantedRadius);
        this.setWantedAlpha(_currentWantedAlpha);
        this.setWantedBeta(_currentWantedBeta);

        this.handleCameraRotation();
        this.handleUpdate();
    }

    private handleCameraRotation() {
        MouseMovementEventManager.registerMouseMovement((deltaX, deltaY) => {
            this._currentWantedAlpha = Scalar.LerpAngle(this._currentWantedAlpha, this._currentWantedAlpha - deltaX * this._horizontalSensitivity, 1);
            this._currentWantedBeta = Scalar.LerpAngle(this._currentWantedBeta, this._currentWantedBeta - deltaY * this._verticalSensitivity, 1);
            this._currentWantedBeta = Scalar.Clamp(this._currentWantedBeta, this._lowerBetaLimit, this._upperBetaLimit);
        })
    }


    private handleUpdate() {
        WorldOld.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnEveryFrameTrigger, () => {
            this.updateSubmarineCamera(GameOld.engine.getDeltaTime() / 1000);
        }))
    }

    private updateSubmarineCamera(deltaTimeInSec: number) {
        this.followSubmarine();
        this.updateCameraRotation(deltaTimeInSec);
    }

    private followSubmarine() {
        this.target = this._submarine.mesh.position;
    }

    private updateCameraRotation(deltaTimeInSec: number) {
        const nextAlpha = Scalar.LerpAngle(this.alpha, this._currentWantedAlpha, deltaTimeInSec * this._cameraRotationLerpFactor);
        const nextBeta = Scalar.LerpAngle(this.beta, this._currentWantedBeta, deltaTimeInSec * this._cameraRotationLerpFactor);
        this.setWantedAlpha(nextAlpha);
        this.setWantedBeta(nextBeta);

    }

    private setWantedRadius(radius: number) {
        this.radius = radius;
        this.lowerRadiusLimit = radius;
        this.upperRadiusLimit = radius;
    }

    private setWantedAlpha(alpha: number) {
        this.alpha = alpha;
        this.lowerAlphaLimit = alpha;
        this.upperAlphaLimit = alpha;
    }

    private setWantedBeta(beta: number) {
        beta = Scalar.Clamp(beta, this._lowerBetaLimit, this._upperBetaLimit);
        this.beta = beta;
        this.lowerBetaLimit = beta;
        this.upperBetaLimit = beta;
    }

}