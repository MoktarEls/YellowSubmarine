import {WaterMaterial} from "@babylonjs/materials";
import {Game} from "@/YellowSubmarine/Game";
import {
    Axis,
    Material,
    MirrorTexture,
    Plane,
    ShaderMaterial,
    StandardMaterial, Texture,
    Vector2,
    Vector3
} from "@babylonjs/core";
import {SkyBox} from "@/YellowSubmarine/sky system/SkyBox";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {Sky} from "@/YellowSubmarine/sky system/Sky";

export class ReflectiveToonWaterMaterial {

    private static _instance: ReflectiveToonWaterMaterial;
    private _mirrorTexture: MirrorTexture;
    private _shaderMaterial: ShaderMaterial;

    public static get instance(): ReflectiveToonWaterMaterial {
        if(!this._instance){
            this._instance = new ReflectiveToonWaterMaterial();
        }
        return this._instance;
    }

    public get material(): Material{
        return this._shaderMaterial;
    }


    private constructor() {
        ReflectiveToonWaterMaterial._instance = this;
        this._mirrorTexture = new MirrorTexture("mirrorTex", 512, Game.scene);
        this._mirrorTexture.mirrorPlane = Plane.FromPositionAndNormal(Vector3.Zero(), Vector3.Down());
        this._mirrorTexture.renderListPredicate = (mesh) => true;

        this._shaderMaterial = new ShaderMaterial("shaderMaterial",Game.scene, {
            vertex: "toonWaterAndReflections", fragment: "toonWaterAndReflections",
        },{
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection", "screensize"],
            samplers: ["reflexion"],
        });

        const canvas = Game.canvas;
        this._shaderMaterial.setVector2("screensize", new Vector2(canvas.width, canvas.height));
        canvas.addEventListener("resize", () => this._shaderMaterial.setVector2("screensize", new Vector2(canvas.width, canvas.height) ) );
        this._shaderMaterial.setTexture("reflexion", this._mirrorTexture);
        Game.scene.customRenderTargets.push(this._mirrorTexture);

    }



}