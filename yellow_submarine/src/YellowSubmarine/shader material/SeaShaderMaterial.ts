import {
    AbstractMesh, Angle, Color3,
    Color4, DepthRenderer, Engine, GeometryBufferRenderer,
    Material, MultiRenderTarget, Nullable, RenderTargetTexture, Scene,
    ShaderMaterial, StandardMaterial, Texture, Vector2, Vector3, Vector4
} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {World} from "@/YellowSubmarine/World";

export class SeaShaderMaterial{

    private static _instance: SeaShaderMaterial;

    private _material: ShaderMaterial;
    private _depthRenderer: DepthRenderer;
    private _depthMap: RenderTargetTexture;


    private constructor() {
        const scene = Game.scene;
        const camera = World.camera;

        this._material = new ShaderMaterial("seaShaderMaterial", scene,{
            vertex: "water", fragment: "water",
        },{
            attributes: ["position", "normal", "uv"],
            uniforms: ["world","view","projection","depthShallowColor", "depthDeepColor", "depthMaximumDistance"],
            samplers: ["linearDepthTexture"],
        });

        this._depthRenderer = scene.enableDepthRenderer(camera, false, undefined, undefined, true);
        this._depthMap = this._depthRenderer.getDepthMap();
        this._depthMap.renderListPredicate = (m) => m.material !== this._material;

        this._material.setVector4("depthShallowColor", new Vector4(0.325, 0.807, 0.971, 0.725));
        this._material.setVector4("depthDeepColor", new Vector4(0.086, 0.407, 1, 0.749));
        this._material.setFloat("depthMaximumDistance", 1.0);
        this._material.setTexture("linearDepthTexture", this._depthMap);

    }

    public static get instance(){
        if(this._instance == null){
            this._instance = new SeaShaderMaterial();
        }
        return this._instance;
    }

    public static get material(){
        return this.instance._material;
    }

}