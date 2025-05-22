import {
    AbstractMesh, DepthRenderer, GeometryBufferRenderer, Material, MirrorTexture,
    MultiRenderTarget, Nullable, Plane, RenderTargetTexture, Scene,
    ShaderMaterial, StandardMaterial, Texture, Vector2, Vector3, Vector4
} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {World} from "@/YellowSubmarine/World";
import {Sky} from "@/YellowSubmarine/sky system/Sky";

export class ReflectiveToonWaterMaterial {

    private static _instance: ReflectiveToonWaterMaterial;

    protected _scene: Scene;
    protected _material: ShaderMaterial;
    private _depthRenderer: DepthRenderer;
    private _depthMap: RenderTargetTexture;
    private _geometryBufferRenderer: Nullable<GeometryBufferRenderer>;
    private _gBuffer: Nullable<MultiRenderTarget> = null;
    private _renderListPredicate: (mesh: AbstractMesh) => boolean;

    protected constructor() {
        ReflectiveToonWaterMaterial._instance = this;
        this._scene = Game.scene;
        const camera = this._scene.activeCamera;

        this._material = new ShaderMaterial("toonWaterMaterial", this._scene,{
            vertex: this.shaderMaterialName, fragment: this.shaderMaterialName,
        },{
            attributes: ["position", "normal", "uv"],
            uniforms: ["world","view","projection","depthShallowColor", "depthDeepColor", "depthMaximumDistance",
                "surfaceNoiseST", "surfaceNoiseCutoff", "foamMaxDistance", "foamMinDistance", "surfaceNoiseScroll", "time", "surfaceDistortionST",
                "surfaceDistortionAmount", "screensize", "timeOfTheDay"],
            samplers: ["linearDepthTexture", "surfaceNoiseTexture","surfaceDistortionTexture","reflectionTexture"],
            needAlphaTesting: true,
        });


        this._depthRenderer = this._scene.enableDepthRenderer(undefined, false, undefined, undefined, true);
        this._depthMap = this._depthRenderer.getDepthMap();
        this._renderListPredicate = (m) => m.material !== this._material;
        this._depthMap.renderListPredicate = this._renderListPredicate;

        this._material.setVector4("depthShallowColor", new Vector4(0.325, 0.807, 0.971, 0.725));
        this._material.setVector4("depthDeepColor", new Vector4(0.086, 0.407, 1, 0.749));
        this._material.setFloat("depthMaximumDistance", 10.0);
        this._material.setTexture("linearDepthTexture", this._depthMap);
        this._material.setVector4("surfaceNoiseST", new Vector4(1, 4, 0, 0));
        this._material.setTexture("surfaceNoiseTexture", new Texture("/textures/PerlinNoise.png"));
        this._material.setFloat("surfaceNoiseCutoff", 0.85);
        this._material.setFloat("foamMaxDistance", 0.6);
        this._material.setFloat("foamMinDistance", 0.04);
        this._material.setVector2("surfaceNoiseScroll", new Vector2(0.03, 0.03));
        this._material.setVector4("surfaceDistortionST", new Vector4(1,1,0,0));
        this._material.setFloat("surfaceDistortionAmount", 0.27);
        this._material.setTexture("surfaceDistortionTexture", new Texture("/textures/WaterDistortion.png"));
        Game.scene.onBeforeRenderObservable.add(() => {
            this._material.setFloat("timeOfTheDay", Sky.instance.dayNightCycle.timeOfTheDay);
        })
        this._material.setVector2("screensize", new Vector2(window.innerWidth, window.innerHeight));
        window.addEventListener("resize", () => this._material.setVector2("screensize", new Vector2(window.innerWidth, window.innerHeight)) );
        const mirrorTexture = new MirrorTexture("mirrorTexture", 1024, Game.scene, true);
        mirrorTexture.mirrorPlane = Plane.FromPositionAndNormal(Vector3.Zero(), Vector3.Down());
        mirrorTexture.renderListPredicate = (m) => m.material !== this._material;
        this._material.setTexture("reflectionTexture", mirrorTexture);
        Game.scene.customRenderTargets.push(mirrorTexture);
        this._material.disableDepthWrite = true;

        this._geometryBufferRenderer = this._scene.enableGeometryBufferRenderer();
        if(this._geometryBufferRenderer != null) {
            this._geometryBufferRenderer.enableNormal;
            this._gBuffer = this._geometryBufferRenderer.getGBuffer();
            this._gBuffer.renderListPredicate = this._renderListPredicate
            const cameraNormalTexture = this._gBuffer.textures[GeometryBufferRenderer.NORMAL_TEXTURE_TYPE];
            this._material.setTexture("cameraNormalTexture", cameraNormalTexture);
        }

        let time = 0;
        Game.scene.onBeforeRenderObservable.add(() => {
            time += (Game.engine.getDeltaTime()/1000) * 0.01;
            this._material.setFloat("time", time);
        })

        /*this._material = new ShaderMaterial("mirror", Game.scene, {
            vertex: "mirror", fragment: "mirror"
        },{
            attributes: ["position", "normal", "uv"],
            uniforms: ["worldViewProjection", "screensize"],
            samplers: ["mirrorSampler"]
        })

        const mirrorTexture = new MirrorTexture("mirrorTex",512, Game.scene);
        mirrorTexture.mirrorPlane = Plane.FromPositionAndNormal(Vector3.Zero(), Vector3.Down());
        mirrorTexture.renderListPredicate = (m) => m.material !== this._material;
        this._material.setTexture("mirrorSampler", mirrorTexture);
        const canvas = Game.canvas;
        this._material.setVector2("screensize", new Vector2(canvas.width, canvas.height));
        canvas.addEventListener("resize", () => this._material.setVector2("screensize", new Vector2(canvas.width, canvas.height)) );
        Game.scene.customRenderTargets.push(mirrorTexture);*/

    }

    public static get instance(){
        if(this._instance == null){
            this._instance = new this();
        }
        return this._instance;
    }

    public static get material(){
        return this.instance._material;
    }

    protected get shaderMaterialName(){ return "toonWaterAndReflections"; }

}