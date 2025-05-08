import {
    AbstractMesh,
    Color4,
    Material,
    ShaderMaterial, Vector4
} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {World} from "@/YellowSubmarine/World";

export class SeaShaderMaterial{

    private static _instance: SeaShaderMaterial;

    public static get instance(){
        if(this._instance == null){
           this._instance = new SeaShaderMaterial();
        }
        return this._instance;
    }

    public static get material(): Material{
        return this.instance._material;
    }

    private _material: ShaderMaterial;

    private constructor() {
        const scene = Game.scene;
        const camera = World.camera;

        this._material = new ShaderMaterial("seaShader", scene,
            {
                vertex: "water", fragment: "water",
            },
            {
                attributes: ["position", "uv"],
                uniforms: ["depthGradientShallow", "depthGradientDeep", "depthMaxDistance","worldViewProjection"],
                samplers: ["cameraDepthTexture"]
            }
        );

        this._material.setVector4("depthGradientShallow", new Vector4(0.325, 0.807, 0.971, 0.725));
        this._material.setVector4("depthGradientDeep", new Vector4(0.086, 0.407, 1, 0.749));
        this._material.setFloat("depthMaxDistance", 1.0);
        this._material.setTexture("cameraDepthTexture", scene.enableDepthRenderer(camera, false).getDepthMap());
    }

}