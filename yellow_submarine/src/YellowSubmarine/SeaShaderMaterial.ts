import {IShaderMaterialOptions, IShaderPath, Scene, ShaderMaterial, Texture} from "@babylonjs/core";

export class SeaShaderMaterial extends ShaderMaterial{

    constructor(
        name: string,
        scene: Scene,
        shaderPath: IShaderPath | string,
        options?: Partial<IShaderMaterialOptions>,
        storeEffectOnSubMeshes?: boolean,
    ) {
        super(name, scene, shaderPath, options, storeEffectOnSubMeshes);

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