import {AbstractMesh, Constants, RenderTargetTexture, ShaderMaterial, Vector4} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {World} from "@/YellowSubmarine/World";

export class SeaShaderMaterial {

    public static get shaderMaterial(): ShaderMaterial {
        return this.instance._shaderMaterial;
    }

    private static _instance: SeaShaderMaterial;

    private static get instance(){
        if(!this._instance){
            this._instance = new SeaShaderMaterial();
        }
        return this._instance;
    }

    private _refractedMeshes: Set<AbstractMesh> = new Set();
    private _foamingMeshes: Set<AbstractMesh> = new Set();

    private _shaderMaterial: ShaderMaterial;
    private _refractionRTT: RenderTargetTexture;
    private _depthTexture: RenderTargetTexture;

    private constructor() {
        const scene = Game.scene;
        const engine = Game.engine;
        const camera = World.camera;

        console.log(scene);
        console.log(engine);
        console.log(camera);


        this._shaderMaterial = new ShaderMaterial("shader", scene, {
            vertex: "foam",
            fragment: "foam"
            },
            {
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"],
        });

        const depthRenderer = scene.enableDepthRenderer(scene.activeCamera,false);
        this._depthTexture = depthRenderer.getDepthMap();
        this._depthTexture.renderList = [];

        this._refractionRTT = new RenderTargetTexture("water_refraction", { width: 256, height: 256 }, scene, false, true);
        this._refractionRTT.wrapU = Constants.TEXTURE_MIRROR_ADDRESSMODE;
        this._refractionRTT.wrapV = Constants.TEXTURE_MIRROR_ADDRESSMODE;
        this._refractionRTT.ignoreCameraViewport = true;
        this._refractionRTT.refreshRate = 1;

        scene.customRenderTargets.push(this._refractionRTT);

        // set shader parameters
        this._shaderMaterial.setTexture("depthTex", this._depthTexture);
        this._shaderMaterial.setTexture("refractionSampler", this._refractionRTT);
        this._shaderMaterial.setFloat("camMinZ", camera.minZ);
        this._shaderMaterial.setFloat("camMaxZ", camera.maxZ);
        this._shaderMaterial.setFloat("time", 0);
        this._shaderMaterial.setFloat("wNoiseScale", 6.0);
        this._shaderMaterial.setFloat("wNoiseOffset", 0.01);
        this._shaderMaterial.setFloat("fNoiseScale", 10.0);
        this._shaderMaterial.setFloat("maxDepth", 5.0);
        this._shaderMaterial.setVector4("wDeepColor", new Vector4(0.0,0.2,0.5,0.8));
        this._shaderMaterial.setVector4("wShallowColor", new Vector4(0.3,0.4,0.8,0.5));

        let time = 0;
        scene.registerBeforeRender(()=> {
            time += engine.getDeltaTime() * 0.001;
            this._shaderMaterial.setFloat("time", time);
        });
    }

    public static addFoamToMesh(mesh: AbstractMesh) {
        console.log("Adding foamToMesh");
        this.instance._foamingMeshes.add(mesh);
        this.updateFoamRenderList();
    }

    public static addRefractionToMesh(mesh: AbstractMesh) {
        console.log("Adding refractionToMesh");
        this.instance._refractedMeshes.add(mesh);
        this.updateRefractionRenderList();
    }

    private static updateFoamRenderList(){
        const meshArray: AbstractMesh[] = [];
        this.instance._foamingMeshes.forEach(mesh => {
            meshArray.push(mesh);
        })
        this.instance._depthTexture.renderList = meshArray;
    }

    private static updateRefractionRenderList(){
        const meshArray: AbstractMesh[] = [];
        this.instance._refractedMeshes.forEach(mesh => {
            meshArray.push(mesh);
        })
        this.instance._refractionRTT.renderList = meshArray;
    }

    private static updateShaderParameter(){
        this.instance._shaderMaterial.setTexture("depthTex", this.instance._depthTexture);
        this.instance._shaderMaterial.setTexture("refractionSampler", this.instance._refractionRTT);
    }


}
