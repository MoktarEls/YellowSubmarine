import {
    Angle,
    ArcRotateCamera,
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

    private _cameraConfiguration?: CameraConfiguration;
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

    public set cameraConfiguration(cameraParameter: CameraConfiguration | undefined) {
        const oldCameraParameter = this._cameraConfiguration;
        this._cameraConfiguration = cameraParameter;
        if(!oldCameraParameter){
            this.jumpToTarget();
        }
    }

    public get cameraConfiguration(): CameraConfiguration | undefined {
        return this._cameraConfiguration;
    }

    private update(deltaTimeInSec: number) {
        this.updatePosition(deltaTimeInSec);
        this.updateRotation(deltaTimeInSec);
    }

    private jumpToTarget(){
        if(this._cameraConfiguration){
            this._arcRotateCamera.target = this._cameraConfiguration.targetPosition;
            this._arcRotateCamera.alpha = this._cameraConfiguration.wantedAlpha;
            this._arcRotateCamera.beta = this._cameraConfiguration.wantedBeta;
            this._arcRotateCamera.radius = this._cameraConfiguration.distanceFromTarget;
        }
    }

    private updatePosition(deltaTimeInSec: number) {
        if(this._cameraConfiguration) {
            const target = this._cameraConfiguration.target;
            if(target){
                this._arcRotateCamera.target = Vector3.Lerp(this._arcRotateCamera.target, this._cameraConfiguration.targetPosition, deltaTimeInSec * this._positionLerpFactor);
            }
            this._arcRotateCamera.radius = Lerp(this._arcRotateCamera.radius, this._cameraConfiguration.distanceFromTarget, deltaTimeInSec * this._positionLerpFactor);
            this._arcRotateCamera.lowerRadiusLimit = this._arcRotateCamera.radius;
            this._arcRotateCamera.upperRadiusLimit = this._arcRotateCamera.radius;
        }
    }

    private updateRotation(deltaTimeInSec: number) {
        if(this._cameraConfiguration) {
            const wantedAlpha = this._cameraConfiguration.wantedAlpha;
            const wantedBeta = this._cameraConfiguration.wantedBeta;
            this._arcRotateCamera.alpha =  Angle.FromDegrees( Scalar.LerpAngle(Angle.FromRadians(this._arcRotateCamera.alpha).degrees(), Angle.FromRadians(wantedAlpha).degrees(), deltaTimeInSec * this._rotationLerpFactor) ).radians();
            this._arcRotateCamera.beta =  Angle.FromDegrees( Scalar.LerpAngle(Angle.FromRadians(this._arcRotateCamera.beta).degrees(), Angle.FromRadians(wantedBeta).degrees(), deltaTimeInSec * this._rotationLerpFactor) ).radians();
        }
    }

}