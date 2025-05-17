import {Angle, Quaternion, TransformNode, Vector3} from "@babylonjs/core";

export class CameraConfiguration {

    private _offset: Vector3 = Vector3.Zero();
    private _wantedAlpha = 0;
    private _wantedBeta = Angle.FromDegrees(80).radians();
    private _distanceFromTarget = 10;
    private _target?: TransformNode
    private _currentLowerBetaLimit? : number;
    private _currentUpperBetaLimit? : number;

    public get targetPosition(): Vector3{
        return ( this._target?.position ?? Vector3.Zero() ).add( this._offset.rotateByQuaternionToRef(this._target?.absoluteRotationQuaternion ?? Quaternion.Identity(), Vector3.Zero() ) );
    }

    public get offset(): Vector3 {
        return this._offset;
    }

    public set offset(offset: Vector3) {
        this._offset = offset;
    }

    public get wantedAlpha(): number {
        return this._wantedAlpha;
    }

    public set wantedAlpha(alpha: number) {
        this._wantedAlpha = alpha;
    }

    public get wantedBeta(): number {
        return this._wantedBeta;
    }

    public set wantedBeta(beta: number) {
        this._wantedBeta = beta;
        if(this._currentLowerBetaLimit){
            this._wantedBeta = Math.max(this._wantedBeta, this._currentLowerBetaLimit);
        }
        if(this._currentUpperBetaLimit){
            this._wantedBeta = Math.min(this._wantedBeta, this._currentUpperBetaLimit);
        }
    }

    public get distanceFromTarget(): number {
        return this._distanceFromTarget;
    }

    public set distanceFromTarget(distanceFromTarget: number) {
        this._distanceFromTarget = distanceFromTarget;
    }

    public get target(): TransformNode | undefined {
        return this._target;
    }

    public set target(target: TransformNode | undefined) {
        this._target = target;
    }

    public get currentUpperBetaLimit(): number | undefined {
        return this._currentUpperBetaLimit;
    }

    public set currentUpperBetaLimit(value: number | undefined) {
        this._currentUpperBetaLimit = value;
    }

    public get currentLowerBetaLimit(): number | undefined {
        return this._currentLowerBetaLimit;
    }

    public set currentLowerBetaLimit(value: number | undefined) {
        this._currentLowerBetaLimit = value;
    }

}
