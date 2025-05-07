import {MeshBuilder, ShaderMaterial, Texture, Vector3} from "@babylonjs/core";
import {GameOld} from "@/YellowSubmarine/GameOld";
import {WorldOld} from "@/YellowSubmarine/WorldOld";

export class SeaOld {

    constructor() {
        const shaderMaterial = this.createSeaShaderMaterial();

        const noiseTexture = new Texture("/textures/noiseTexture.png", WorldOld.scene);
        shaderMaterial.setTexture("noiseTexture", noiseTexture);

        this.setTimeFloatInShader(shaderMaterial);

        const waterPlane = this.createWaterPlane();

        waterPlane.material = shaderMaterial;
    }

    private setTimeFloatInShader(shaderMaterial: ShaderMaterial) {
        let time = 0;
        WorldOld.scene.registerBeforeRender(() => {
            time += GameOld.engine.getDeltaTime() * 0.0008;
            shaderMaterial.setFloat("time", time);
        });
    }

    private createSeaShaderMaterial() {
        const shaderMaterial = new ShaderMaterial("waterShader", WorldOld.scene, {
        vertex: "water",
        fragment: "water"
        }, {
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection", "time"],
            samplers: ["noiseTexture"]
        });

        const sun = GameOld.world.getSun();
        const noiseTexture = new Texture("/textures/noiseTexture.png", GameOld.worldScene);
        shaderMaterial.setTexture("noiseTexture", noiseTexture);

        console.log("Light Direction: ", sun.getLightDirection());
        console.log("Light Color: ", sun.getLightColor());
        console.log("Ambient Color: ", sun.getAmbientColor());

        shaderMaterial.setVector3("lightDirection", sun.getLightDirection());
        shaderMaterial.setVector3("lightColor", sun.getLightColor());
        shaderMaterial.setVector3("ambientColor", sun.getAmbientColor());
        shaderMaterial.alpha = 0.6;
        return shaderMaterial;
    }

    private createWaterPlane() {
        return MeshBuilder.CreateGround("waterPlane", {
            width: 20,
            height: 20,
            subdivisions: 64
        }, WorldOld.scene);
    }
}