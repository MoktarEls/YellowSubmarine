import {
    AbstractMesh, Angle, Color3,
    Color4, ColorGradingTexture, Engine, GeometryBufferRenderer,
    Material, Nullable, Quaternion, RenderTargetTexture, Scene,
    ShaderMaterial, StandardMaterial, Texture, TransformNode, UniversalCamera, Vector2, Vector3, Vector4
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

    public static get material(){
        return this.instance._material;
    }

    private _material: ShaderMaterial;
    private _scene;

    private _geometryBufferRenderer: Nullable<GeometryBufferRenderer>;
    private _gbuffer;
    private _depthMap: Texture;
    private _normalMap: Texture;

    private constructor() {
        const scene = Game.scene;
        this._scene = scene;
        const camera = World.camera;

        this._material = new ShaderMaterial("seaShader", scene,
            {
                vertex: "water", fragment: "water",
            },
            {
                attributes: ["position", "uv", "normal"],
                uniforms: ["world", "view", "projection", "surfaceNoiseST", "surfaceDistortionST",
                    "depthGradientShallow", "depthGradientDeep", "foamColor", "depthMaxDistance",
                    "foamMaximumDistance", "foamMinimumDistance", "surfaceNoiseCutoff", "surfaceDistortionAmount",
                    "surfaceNoiseScroll", "uCameraNear", "uCameraFar" ],
                samplers: ["cameraDepthTexture", "cameraNormalsTexture", "surfaceNoise", "surfaceDistortion"],
                needAlphaBlending: true,
            }
        );


        this._geometryBufferRenderer = scene.enableGeometryBufferRenderer();
        if(this._geometryBufferRenderer != null){
            this._geometryBufferRenderer.enableDepth = true;
            this._geometryBufferRenderer.enableNormal = true;
            this._gbuffer = this._geometryBufferRenderer.getGBuffer();

            this._gbuffer.renderListPredicate = (mesh) => mesh.material !== this._material;

            this._depthMap = this._gbuffer.textures[GeometryBufferRenderer.DEPTH_TEXTURE_TYPE];
            this._normalMap = this._gbuffer.textures[GeometryBufferRenderer.NORMAL_TEXTURE_TYPE];

            this._material.setVector4("surfaceNoiseST", new Vector4(1,1,0,0));
            this._material.setVector4("surfaceDistortionST", new Vector4(1,1,0,0));
            this._material.setVector4("depthGradientShallow", new Vector4(0.325, 0.807, 0.971, 0.725));
            this._material.setVector4("depthGradientDeep", new Vector4(0.086, 0.407, 1, 0.749));
            this._material.setVector4("foamColor", new Vector4(1,1,1,1));
            this._material.setFloat("depthMaxDistance", 1.0);
            this._material.setFloat("foamMaximumDistance", 0.4);
            this._material.setFloat("foamMinimumDistance", 0.04);
            this._material.setFloat("surfaceNoiseCutoff", 0.777);
            this._material.setFloat("surfaceDistortionAmount", 0.27);
            this._material.setVector2("surfaceNoiseScroll", new Vector2(0.03,0.03));
            this._material.setFloat("uCameraNear", camera.minZ);
            this._material.setFloat("uCameraFar", camera.maxZ);
            this._material.setTexture("cameraDepthTexture", this._depthMap);
            this._material.setTexture("cameraNormalsTexture", this._normalMap);
            this._material.setTexture("surfaceNoise", new Texture("/textures/PerlinNoise.png"));
            this._material.setTexture("surfaceDistortion", new Texture("/textures/WaterDistortion.png"));
        }
        else{
            this._depthMap = new Texture("no_depthMap");
            this._normalMap = new Texture("no_normalMap");
        }


    }

}