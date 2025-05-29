import {
    ReflectionProbe, RenderTargetTexture
} from "@babylonjs/core";
import {ToonWaterMaterial} from "@/YellowSubmarine/shader material/ToonWaterMaterial";

export class ToonWaterAndProbeMaterial extends ToonWaterMaterial {

    protected get shaderMaterialName() { return "toonWaterAndProbe"; }

    private _reflectionProbe: ReflectionProbe;
    private _reflectionCube: RenderTargetTexture;

    private constructor() {
        super();
        this._reflectionProbe = new ReflectionProbe("seaShaderReflectionProbe", 512, this._scene);
        this._reflectionCube = this._reflectionProbe.cubeTexture;
        this._material.setTexture("reflectionSampler", this._reflectionCube);

    }

}