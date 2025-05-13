import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {MeshBuilder} from "@babylonjs/core";

export class SphericDetectionZone extends MeshDetectionZone {

    constructor(radius : number, debug ?: boolean) {
        const mesh = MeshBuilder.CreateSphere("", {
            diameter : radius * 2
        });
        super(mesh, debug);
    }
}