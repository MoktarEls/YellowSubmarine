import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {Observable} from "@babylonjs/core";

export class KeyZone {

    protected _name: string;
    protected _detectionZone: MeshDetectionZone;
    protected _discovered = false;
    protected _disabled = false;

    public static onAnyKeyZoneEntered: Observable<KeyZone> = new Observable();

    constructor(name:string, detectionZone: MeshDetectionZone) {
        this._name = name;
        this._detectionZone = detectionZone;
        this.detectionZone.onMeshEnter.add( () => {
            KeyZone.onAnyKeyZoneEntered.notifyObservers(this);
            this._discovered = true;
        })
    }

    public get name(): string {
        return this._name;
    }

    public get discovered(): boolean {
        return this._discovered;
    }

    public get detectionZone(): MeshDetectionZone {
        return this._detectionZone;
    }
}