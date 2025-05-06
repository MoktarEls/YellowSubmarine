import {ShaderMaterial, Vector3} from "@babylonjs/core";

export class CartoonShaderMaterial extends ShaderMaterial{

    constructor() {
        super('shader', GameOld._worldScene, {
            vertex : "shader",
            fragment : "shader",
        }, {
            attributes: ['position', 'normal', 'uv'],
            uniforms: ['world', 'worldView', 'worldViewProjection'],
        })

        this.setVector3('vLightPosition', GameOld._world.getSun().getPosition());
        this.setVector3('vColor', new Vector3(0.5, 0.5, 0.5));
    }

}