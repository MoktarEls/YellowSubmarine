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
    private _geometryBufferRenderer: Nullable<GeometryBufferRenderer>;
    private _gBuffer: Nullable<MultiRenderTarget> = null;


    private constructor() {
        const scene = Game.scene;
        const camera = World.camera;

        this._material = new ShaderMaterial("seaShaderMaterial", scene,{
            vertex: "water", fragment: "water",
        },{
            attributes: ["position", "normal", "uv"],
            uniforms: ["world","view","projection","depthShallowColor", "depthDeepColor", "depthMaximumDistance",
            "surfaceNoiseST", "surfaceNoiseCutoff", "foamMaxDistance", "foamMinDistance", "surfaceNoiseScroll", "time", "surfaceDistortionST",
            "surfaceDistortionAmount"],
            samplers: ["linearDepthTexture", "surfaceNoiseTexture","surfaceDistortionTexture"],
            needAlphaBlending: true,
        });


        this._depthRenderer = scene.enableDepthRenderer(camera, false, undefined, undefined, true);
        this._depthMap = this._depthRenderer.getDepthMap();
        this._depthMap.renderListPredicate = (m) => m.material !== this._material;

        this._material.setVector4("depthShallowColor", new Vector4(0.325, 0.807, 0.971, 0.725));
        this._material.setVector4("depthDeepColor", new Vector4(0.086, 0.407, 1, 0.749));
        this._material.setFloat("depthMaximumDistance", 10.0);
        this._material.setTexture("linearDepthTexture", this._depthMap);
        this._material.setVector4("surfaceNoiseST", new Vector4(1, 4, 0, 0));
        this._material.setTexture("surfaceNoiseTexture", new Texture("/textures/PerlinNoise.png"));
        this._material.setFloat("surfaceNoiseCutoff", 0.9);
        this._material.setFloat("foamMaxDistance", 0.4);
        this._material.setFloat("foamMinDistance", 0.04);
        this._material.setVector2("surfaceNoiseScroll", new Vector2(0.03, 0.03));
        this._material.setVector4("surfaceDistortionST", new Vector4(1,1,0,0));
        this._material.setFloat("surfaceDistortionAmount", 0.27);
        this._material.setTexture("surfaceDistortionTexture", new Texture("/textures/WaterDistortion.png"));
        this._material.disableDepthWrite = true;

        this._geometryBufferRenderer = scene.enableGeometryBufferRenderer();
        if(this._geometryBufferRenderer != null) {
            this._geometryBufferRenderer.enableNormal;
            this._gBuffer = this._geometryBufferRenderer.getGBuffer();
            const cameraNormalTexture = this._gBuffer.textures[GeometryBufferRenderer.NORMAL_TEXTURE_TYPE];
            this._material.setTexture("cameraNormalTexture", cameraNormalTexture);
        }

        let time = 0;
        Game.registerUpdateAction((deltaTimeInSeconds) => {
            time += deltaTimeInSeconds * 0.01;
            this._material.setFloat("time", time);
        })

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