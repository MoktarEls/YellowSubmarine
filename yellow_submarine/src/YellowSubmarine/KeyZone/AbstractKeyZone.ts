import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";

export class AbstractKeyZone {

    protected _discovered: boolean;
    protected _detectionZone: MeshDetectionZone;
    protected _disabled = false;

    constructor(discovered: boolean, detectionZone: MeshDetectionZone) {
        this._discovered = discovered;
        this._detectionZone = detectionZone;
    }


    public get discovered(): boolean {
        return this._discovered;
    }

    public get detectionZone(): MeshDetectionZone {
        return this._detectionZone;
    }
}