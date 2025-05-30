import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {MeshBuilder, Vector4} from "@babylonjs/core";

export class SphericalDetectionZone extends MeshDetectionZone {

    constructor(options ?: {segments?: number, diameter?: number,
        diameterX?: number, diameterY?: number, diameterZ?: number, arc?: number,
        slice?: number, sideOrientation?: number, frontUVs?: Vector4,
        backUVs?: Vector4, updatable?: boolean}, debug ?: boolean) {

        const mesh = MeshBuilder.CreateSphere("", options);
        super(mesh, false);
    }
}