import {ShaderMaterial, Texture} from "@babylonjs/core";
import {World} from "@/YellowSubmarine/World";
import {Game} from "@/YellowSubmarine/Game";

export class SeaShaderMaterial {

    public get shaderMaterial(): ShaderMaterial {
        return this._shaderMaterial;
    }

    private _shaderMaterial: ShaderMaterial;

    constructor() {
        this._shaderMaterial = new ShaderMaterial("waterShader", World.scene, {
            vertex: "water",
            fragment: "water"
        }, {
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection", "time"],
            samplers: ["noiseTexture"]
        });

        const sun = World.sun;
        const noiseTexture = new Texture("/textures/noiseTexture.png", World.scene);
        this._shaderMaterial.setTexture("noiseTexture", noiseTexture);

        console.log("Light Direction: ", sun.getLightDirection());
        console.log("Light Color: ", sun.getLightColor());
        console.log("Ambient Color: ", sun.getAmbientColor());

        this._shaderMaterial.setVector3("lightDirection", sun.getLightDirection());
        this._shaderMaterial.setVector3("lightColor", sun.getLightColor());
        this._shaderMaterial.setVector3("ambientColor", sun.getAmbientColor());
        this._shaderMaterial.alpha = 0.6;
        this.setTimeFloatInShader();
    }

    private setTimeFloatInShader() {
        let time = 0;
        Game.registerUpdateAction((deltaTimeInSeconds) => {
            time += deltaTimeInSeconds * 1000 * 0.0008;
            this._shaderMaterial.setFloat("time", time);
        });
    }

}