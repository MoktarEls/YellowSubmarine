import {ShaderMaterial, Vector3} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {World} from "@/YellowSubmarine/World";

export class CartoonShaderMaterial extends ShaderMaterial{

    constructor() {
        super('shader', Game.scene, {
            vertex : "shader",
            fragment : "shader",
        }, {
            attributes: ['position', 'normal', 'uv'],
            uniforms: ['world', 'worldView', 'worldViewProjection'],
        })

        this.setVector3('vLightPosition', World.sun.getPosition());
        this.setVector3('vColor', new Vector3(0.5, 0.5, 0.5));
    }

}