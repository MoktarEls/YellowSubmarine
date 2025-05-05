import {MeshBuilder, ShaderMaterial, Texture} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export class Sea{

    constructor() {
        const shaderMaterial = this.createSeaShaderMaterial();

        const noiseTexture = new Texture("/textures/noiseTexture.png", Game.WorldScene);
        shaderMaterial.setTexture("noiseTexture", noiseTexture);

        this.setTimeFloatInShader(shaderMaterial);

        const waterPlane = this.createWaterPlane();

        waterPlane.material = shaderMaterial;
    }

    private setTimeFloatInShader(shaderMaterial: ShaderMaterial) {
        let time = 0;
        Game.WorldScene.registerBeforeRender(() => {
            time += Game.Engine.getDeltaTime() * 0.0008;
            shaderMaterial.setFloat("time", time);
        });
    }

    private createSeaShaderMaterial() {
        return new ShaderMaterial("waterShader", Game.WorldScene, {
        vertex: "water",
        fragment: "water"
        }, {
        attributes: ["position", "uv"],
        uniforms: ["worldViewProjection", "time"],
        samplers: ["noiseTexture"]
        });
    }

    private createWaterPlane() {
        return MeshBuilder.CreateGround("waterPlane", {
            width: 20,
            height: 20,
            subdivisions: 64
        }, Game.WorldScene);
    }
}