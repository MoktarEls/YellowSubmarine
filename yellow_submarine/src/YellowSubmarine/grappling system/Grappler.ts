import {DistanceConstraint, PhysicsBody, PhysicsConstraint, TransformNode, Vector3} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export class Grappler {


    private _parent?: PhysicsBody;
    private _grapplerLength = 3;
    private _breakingLength = 10;
    private _currentGrappledObject?: PhysicsBody;
    private _localOffsetWithSubmarine: Vector3 = new Vector3(0, 0, -5);
    private _pullingForce = 3;

    constructor() {
        Game.scene.onBeforeRenderObservable.add(() => {
            this.updateGrappledObject();
        })
    }

    public grappleObject(object: PhysicsBody) {
        if(this._currentGrappledObject) return;

        this._currentGrappledObject = object;

    }

    public letGoOfObject() {
        if(!this._currentGrappledObject) return;

        this._currentGrappledObject = undefined;
    }

    public get grapplerLength(): number {
        return this._grapplerLength;
    }

    public set grapplerLength(length: number) {
        this._grapplerLength = length;
    }

    public get parent(): PhysicsBody | undefined {
        return this._parent;
    }

    public set parent(submarine: PhysicsBody | undefined) {
        this._parent = submarine;
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
            const parent = this._parent;
            if(parent){
                const positionWithOffset = parent.getObjectCenterWorld().add(this._localOffsetWithSubmarine.rotateByQuaternionToRef(parent.transformNode.absoluteRotationQuaternion, Vector3.Zero()));

                const grappledObjectPosition = this._currentGrappledObject.getObjectCenterWorld();
                const fromGrapplerToObject = grappledObjectPosition.subtract(positionWithOffset);
                const distance = fromGrapplerToObject.length();
                if(distance > this._breakingLength){
                    console.log("Cassé !!!")
                    this.letGoOfObject();
                }else if(distance > this._grapplerLength){
                    const pullingDirection = fromGrapplerToObject.normalizeToNew().scale(-1);
                    this._currentGrappledObject.applyForce(pullingDirection.scale(this._pullingForce * (1 + (distance - this._grapplerLength)) ), grappledObjectPosition);
                }

            }

        }
    }

}