import {ShaderMaterial, Texture} from "@babylonjs/core";

export class SeaShaderMaterial extends ShaderMaterial{

    constructor() {
        super("waterShader", WorldOld.scene, {
            vertex: "water",
            fragment: "water"
        }, {
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection", "time"],
            samplers: ["noiseTexture"]
        });

        const sun = GameOld.world.getSun();
        const noiseTexture = new Texture("/textures/noiseTexture.png", GameOld.worldScene);
        this.setTexture("noiseTexture", noiseTexture);

        console.log("Light Direction: ", sun.getLightDirection());
        console.log("Light Color: ", sun.getLightColor());
        console.log("Ambient Color: ", sun.getAmbientColor());

        this.setVector3("lightDirection", sun.getLightDirection());
        this.setVector3("lightColor", sun.getLightColor());
        this.setVector3("ambientColor", sun.getAmbientColor());
        this.alpha = 0.6;
    }

}