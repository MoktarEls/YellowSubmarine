import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";

export class AbstractKeyZone {

    protected _name: string;
    protected _discovered: boolean;
    protected _detectionZone: MeshDetectionZone;

    constructor(name: string, discovered: boolean, detectionZone: MeshDetectionZone) {
        this._name = name;
        this._discovered = discovered;
        this._detectionZone = detectionZone;
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