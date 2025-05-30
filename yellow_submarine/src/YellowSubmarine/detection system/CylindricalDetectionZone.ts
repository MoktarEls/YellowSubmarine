import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {Color4, MeshBuilder, Vector4} from "@babylonjs/core";

export class CylindricalDetectionZone extends MeshDetectionZone {

    constructor(options ?: {height?: number, diameterTop?: number, diameterBottom?: number, diameter?: number,
        tessellation?: number, subdivisions?: number, arc?: number,
        faceColors?: Color4[], faceUV?: Vector4[], updatable?: boolean,
        hasRings?: boolean, enclose?: boolean, cap?: number, sideOrientation?: number,
        frontUVs?: Vector4, backUVs?: Vector4}, debug ?: boolean) {

        const mesh = MeshBuilder.CreateCylinder("", options);
        super(mesh, false);
    }
}