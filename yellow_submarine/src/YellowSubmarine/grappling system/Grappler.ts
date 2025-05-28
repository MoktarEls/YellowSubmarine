import {DistanceConstraint, Observable, PhysicsBody, PhysicsConstraint, TransformNode, Vector3} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {TempleBall} from "@/YellowSubmarine/temple/TempleBall";

export class Grappler {

    private static _instance: Grappler;

    private _owner?: PhysicsBody;
    private _grapplerLength = 1.5;
    private _currentGrappledObject?: TempleBall;
    private _localOffsetWithSubmarine: Vector3 = new Vector3(0, 0, -5);
    private _pullingForce = 5;

    public static get instance(): Grappler {
        return this._instance;
    }

    constructor() {
        Grappler._instance = this;
        Game.scene.onBeforeRenderObservable.add(() => {
            this.updateGrappledObject();
        })
    }

    public grappleObject(object: TempleBall) {
        if(this._currentGrappledObject) return;

        this._currentGrappledObject = object;

    }

    public letGoOfObject() {
        if(!this._currentGrappledObject) return;

        this._currentGrappledObject = undefined;
    }

    public get grappledObject(): TempleBall | undefined {
        return this._currentGrappledObject;
    }

    public get hasAnObjectGrappled(): boolean {
        return this._currentGrappledObject !== undefined;
    }

    public get grapplerLength(): number {
        return this._grapplerLength;
    }

    public set grapplerLength(length: number) {
        this._grapplerLength = length;
    }

    public get owner(): PhysicsBody | undefined {
        return this._owner;
    }

    public set owner(submarine: PhysicsBody | undefined) {
        this._owner = submarine;
    }

    public get offset(): Vector3 {
        return this._localOffsetWithSubmarine;
    }

    public set offset(offset: Vector3) {
        this._localOffsetWithSubmarine = offset;
    }

    // -------------------------------------------------------------------------------------------------------------- //

    private updateGrappledObject(){
        if(this._currentGrappledObject !== undefined){
            const parent = this._owner;
            if(parent){
                const positionWithOffset = parent.getObjectCenterWorld().add(this._localOffsetWithSubmarine.rotateByQuaternionToRef(parent.transformNode.absoluteRotationQuaternion, Vector3.Zero()));

                const grappledObjectPosition = this._currentGrappledObject.physicsBody.getObjectCenterWorld();
                const fromGrapplerToObject = grappledObjectPosition.subtract(positionWithOffset);
                const distance = fromGrapplerToObject.length();
                if(distance > this._grapplerLength){
                    const pullingDirection = fromGrapplerToObject.normalizeToNew().scale(-1);
                    this._currentGrappledObject.physicsBody.applyForce(pullingDirection.scale(this._pullingForce * (1 + (distance - this._grapplerLength)) ), grappledObjectPosition);
                }

            }

        }
    }

}