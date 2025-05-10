import {ShaderMaterial, Vector3} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {World} from "@/YellowSubmarine/World";

export class CartoonShaderMaterial {
    get shaderMaterial(): ShaderMaterial {
        return this._shaderMaterial;
    }

    private _shaderMaterial: ShaderMaterial;

    constructor() {
        this._shaderMaterial = new ShaderMaterial('shader', Game.scene, {
            vertex : "shader",
            fragment : "shader",
        }, {
            attributes: ['position', 'normal', 'uv'],
            uniforms: ['world', 'worldView', 'worldViewProjection'],
        })

        this.shaderMaterial.setVector3('vLightPosition', World.sun._defaultPosition);
        this.shaderMaterial.setVector3('vColor', new Vector3(0.5, 0.5, 0.5));
    }

}