import {AbstractKeyZone} from "@/YellowSubmarine/KeyZone/AbstractKeyZone";
import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";

export class IslandKeyZone extends AbstractKeyZone {
    protected _name: string;

    constructor(name: string, discovered: boolean, detectionZone: MeshDetectionZone) {
        super(discovered, detectionZone);
        this._name = name;
    }

    public get name(): string {
        return this._name;
    }
}