import {Submarine} from "@/YellowSubmarine/Submarine";
import {
    ActionManager,
    Angle,
    ArcRotateCamera,
    Camera,
    ExecuteCodeAction, Matrix,
    PointerEventTypes, Quaternion, Scalar,
    Vector3
} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {World} from "@/YellowSubmarine/World";

export class SubmarineCamera {
    get camera(): Camera {
        return this._camera;
    }

    private readonly _camera: ArcRotateCamera;
    private _horizontalSensitivity = 5;
    private _verticalSensitivity = 5;
    private _cameraRotationLerpFactor = 3;

    private _wantedRadius = 15;
    private _currentWantedAlpha = Angle.FromDegrees(-90).radians();
    private _currentWantedBeta = Angle.FromDegrees(45).radians();
    private _lowerBetaLimit = Angle.FromDegrees(30).radians();
    private _upperBetaLimit = Angle.FromDegrees(85).radians();

    private _isPointerLocked = false;

    constructor(private _submarine: Submarine) {
        this._camera = new ArcRotateCamera("submarineCamera", this._currentWantedAlpha, Angle.FromDegrees(this._currentWantedBeta).radians(), this._wantedRadius, Vector3.Zero());

        this.setRadius(this._wantedRadius);
        this.setAlpha(this._currentWantedAlpha);
        this.setBeta(this._currentWantedBeta);

        this.handlePointerLocking();
        this.handleCameraRotation();
        this.handleUpdate();
    }

    public xzRotationQuaternion(): Quaternion {
        const wantedForward = this.camera.getDirection(Vector3.Forward());
        wantedForward.y = 0;
        wantedForward.normalize();
        const wantedUp = Vector3.Up();
        const wantedRight = wantedUp.cross(wantedForward);

        const wantedRotationMatrix = new Matrix();
        Matrix.FromXYZAxesToRef(wantedRight, wantedUp, wantedForward, wantedRotationMatrix);
        return Quaternion.FromRotationMatrix(wantedRotationMatrix);
    }

    private handleCameraRotation() {
        World.scene.onPointerObservable.add((pointerInfo) => {
            if (this._isPointerLocked && pointerInfo.type === PointerEventTypes.POINTERMOVE) {
                const event = pointerInfo.event as PointerEvent;
                const canvas = Game.canvas;
                const deltaX = event.movementX/canvas.width;
                const deltaY = event.movementY/canvas.height;

                this._currentWantedAlpha = Scalar.LerpAngle(this._currentWantedAlpha, this._currentWantedAlpha - deltaX * this._horizontalSensitivity, 1);
                this._currentWantedBeta = Scalar.LerpAngle(this._currentWantedBeta, this._currentWantedBeta - deltaY * this._verticalSensitivity, 1);
                this._currentWantedBeta = Scalar.Clamp(this._currentWantedBeta, this._lowerBetaLimit, this._upperBetaLimit);
            }
        });
    }

    private handlePointerLocking() {
        const canvas = Game.engine.getRenderingCanvas();
        if (canvas) {
            canvas.addEventListener("click", () => {
                canvas.requestPointerLock();
            });
            document.addEventListener("pointerlockchange", () => {
                this._isPointerLocked = document.pointerLockElement === canvas;
            });
        }
    }

    private handleUpdate() {
        World.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnEveryFrameTrigger, () => {
            this.update(Game.engine.getDeltaTime() / 1000);
        }))
    }

    private update(deltaTimeInSec: number) {
        this.followSubmarine(deltaTimeInSec);
        this.updateCameraRotation(deltaTimeInSec);
    }

    private followSubmarine(deltaTimeInSec: number) {
        this._camera.target = this._submarine.mesh.position;
    }

    private updateCameraRotation(deltaTimeInSec: number) {
        const nextAlpha = Scalar.LerpAngle(this._camera.alpha, this._currentWantedAlpha, deltaTimeInSec * this._cameraRotationLerpFactor);
        const nextBeta = Scalar.LerpAngle(this._camera.beta, this._currentWantedBeta, deltaTimeInSec * this._cameraRotationLerpFactor);
        this.setAlpha(nextAlpha);
        this.setBeta(nextBeta);

    }

    private setRadius(radius: number) {
        this._camera.radius = radius;
        this._camera.lowerRadiusLimit = radius;
        this._camera.upperRadiusLimit = radius;
    }

    private setAlpha(alpha: number) {
        this._camera.alpha = alpha;
        this._camera.lowerAlphaLimit = alpha;
        this._camera.upperAlphaLimit = alpha;
    }

    private setBeta(beta: number) {
        beta = Scalar.Clamp(beta, this._lowerBetaLimit, this._upperBetaLimit);
        this._camera.beta = beta;
        this._camera.lowerBetaLimit = beta;
        this._camera.upperBetaLimit = beta;
    }

}