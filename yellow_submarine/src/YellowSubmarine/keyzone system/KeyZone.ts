import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {AbstractMesh, Observable, PhysicsAggregate} from "@babylonjs/core";
import {World} from "@/YellowSubmarine/World";

export class KeyZone {

    private  _name!: string;
    private _detectionZone!: MeshDetectionZone;
    private  _discovered = false;
    private  _disabled = false;
    private _mesh!:AbstractMesh;
    private _physicsAggregate?: PhysicsAggregate;

    public static onAnyKeyZoneEntered: Observable<KeyZone> = new Observable();


    public set name(value: string) {
        this._name = value;
    }
    public get name(): string {
        return this._name;
    }


    public set discovered(value: boolean) {
        this._discovered = value;
    }
    public get discovered(): boolean {
        return this._discovered;
    }


    public set detectionZone(value: MeshDetectionZone) {
        this._detectionZone = value;
        this.detectionZone.onMeshEnter.add( () => {
            KeyZone.onAnyKeyZoneEntered.notifyObservers(this);
            this.discovered = true;
        });
    }
    public get detectionZone(): MeshDetectionZone {
        return this._detectionZone;
    }


    public set disabled(value: boolean) {
        this._disabled = value;
    }
    public get disabled():boolean {
        return this._disabled;
    }

    public set mesh(value: AbstractMesh) {
        this._mesh = value;
        this._detectionZone.zone.parent = this._mesh;
        World.submarine.meshCreationPromise.then((mesh: AbstractMesh) => {
            this.detectionZone.addMeshToDetect(mesh);
        });
    }
    public get mesh() {
        return this._mesh;
    }

    public get physicsAggregate(): PhysicsAggregate | undefined {
        return this._physicsAggregate;
    }

    public set physicsAggregate(physicsAggregate: PhysicsAggregate | undefined){
        this._physicsAggregate = physicsAggregate;
    }

}