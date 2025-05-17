import {
    Angle,
    ArcRotateCamera,
    Quaternion,
    Scalar,
    Vector3
} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {Lerp} from "@babylonjs/core/Maths/math.scalar.functions";

export class ConfigurableCamera {
    private static _instance: ConfigurableCamera;

    public static get instance(): ConfigurableCamera {
        return this._instance;
    }

    private _cameraParameter?: CameraConfiguration;
    private _arcRotateCamera: ArcRotateCamera;
    private _positionLerpFactor = 2.0;
    private _rotationLerpFactor = 2.0;

    constructor() {
        ConfigurableCamera._instance = this;
        this._arcRotateCamera = new ArcRotateCamera("customCamera", 0, 0, 0, Vector3.Zero(), Game.scene);
        Game.scene.onBeforeRenderObservable.add( () => {
            const deltaTimeInSeconds = Game.engine.getDeltaTime() / 1000;
            this.update(deltaTimeInSeconds);
        } );
    }

    public set cameraParameter(cameraParameter: CameraConfiguration | undefined) {
        const oldCameraParameter = this._cameraParameter;
        this._cameraParameter = cameraParameter;
        if(!oldCameraParameter){
            this.jumpToTarget();
        }
    }

    public get cameraParameter(): CameraConfiguration | undefined {
        return this._cameraParameter;
    }

    private update(deltaTimeInSec: number) {
        this.updatePosition(deltaTimeInSec);
        this.updateRotation(deltaTimeInSec);
    }

    private jumpToTarget(){
        if(this._cameraParameter){
            this._arcRotateCamera.target = this._cameraParameter.targetPosition;
            this._arcRotateCamera.alpha = this._cameraParameter.wantedAlpha;
            this._arcRotateCamera.beta = this._cameraParameter.wantedBeta;
            this._arcRotateCamera.radius = this._cameraParameter.distanceFromTarget;
        }
    }

    private updatePosition(deltaTimeInSec: number) {
        if(this._cameraParameter) {
            const target = this._cameraParameter.target;
            if(target){
                this._arcRotateCamera.target = Vector3.Lerp(this._arcRotateCamera.target, this._cameraParameter.targetPosition, deltaTimeInSec * this._positionLerpFactor);
            }
            this._arcRotateCamera.radius = Lerp(this._arcRotateCamera.radius, this._cameraParameter.distanceFromTarget, deltaTimeInSec * this._positionLerpFactor);
            this._arcRotateCamera.lowerRadiusLimit = this._arcRotateCamera.radius;
            this._arcRotateCamera.upperRadiusLimit = this._arcRotateCamera.radius;
        }
    }

    private updateRotation(deltaTimeInSec: number) {
        if(this._cameraParameter) {
            const wantedAlpha = this._cameraParameter.wantedAlpha;
            const wantedBeta = this._cameraParameter.wantedBeta;
            this._arcRotateCamera.alpha =  Angle.FromDegrees( Scalar.LerpAngle(Angle.FromRadians(this._arcRotateCamera.alpha).degrees(), Angle.FromRadians(wantedAlpha).degrees(), deltaTimeInSec * this._rotationLerpFactor) ).radians();
            this._arcRotateCamera.beta =  Angle.FromDegrees( Scalar.LerpAngle(Angle.FromRadians(this._arcRotateCamera.beta).degrees(), Angle.FromRadians(wantedBeta).degrees(), deltaTimeInSec * this._rotationLerpFactor) ).radians();
        }
    }

}