import {
    Color3, CubeTexture,
    Mesh,
    MeshBuilder,
    ShaderMaterial, StandardMaterial, Texture
} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {Sky} from "@/YellowSubmarine/sky system/Sky";


export class SkyBox {

    private static _instance: SkyBox;
    private _daySkyboxTexture: CubeTexture;
    private _nightSkyboxTexture: CubeTexture;
    private _shaderMaterial: ShaderMaterial;

    public static get instance(): SkyBox {
        return this._instance;
    }

    public get mesh(): Mesh {
        return this._mesh;
    }

    private _mesh: Mesh;

    constructor() {
        SkyBox._instance = this;
        this._mesh = MeshBuilder.CreateBox("skyBox", { size: 10000 }, Game.scene);
        this._mesh.infiniteDistance = true;
        this._mesh.isPickable = false;

        this._shaderMaterial = new ShaderMaterial("skyboxMaterial", Game.scene, {
            vertex: "skyboxShader", fragment: "skyboxShader",
        },{
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection", "timeOfTheDay"],
            samplers: ["daySkyboxTexture", "nightSkyboxTexture"],
        })

        Game.scene.onBeforeRenderObservable.add(() => {
            this._shaderMaterial.setFloat("timeOfTheDay", Sky.instance.dayNightCycle.timeOfTheDay);
        })

        this._daySkyboxTexture = CubeTexture.CreateFromImages([
            "/textures/skybox/day/px.png",
            "/textures/skybox/day/pz.png",
            "/textures/skybox/day/py.png",
            "/textures/skybox/day/nx.png",
            "/textures/skybox/day/nz.png",
            "/textures/skybox/day/ny.png"
        ], Game.scene);
        this._daySkyboxTexture.coordinatesMode = Texture.SKYBOX_MODE;
        this._nightSkyboxTexture = CubeTexture.CreateFromImages([
            "/textures/skybox/night/px.png",
            "/textures/skybox/night/pz.png",
            "/textures/skybox/night/py.png",
            "/textures/skybox/night/nx.png",
            "/textures/skybox/night/nz.png",
            "/textures/skybox/night/ny.png"
        ], Game.scene);
        this._nightSkyboxTexture.coordinatesMode = Texture.SKYBOX_MODE;

        this._shaderMaterial.setTexture("daySkyboxTexture", this._daySkyboxTexture);
        this._shaderMaterial.setTexture("nightSkyboxTexture", this._nightSkyboxTexture);
        this._shaderMaterial.backFaceCulling = false;

        this._mesh.material = this._shaderMaterial;


/*
        const material = new ShaderMaterial("skyShader", Game.scene, {
            vertex: "sky",
            fragment: "sky",
        }, {
            attributes: ["position"],
            uniforms: [
                "worldViewProjection", "timeOfDay",
                "dayTop", "dayBottom",
                "sunsetTop", "sunsetBottom",
                "dayTop", "nightBottom",
                "dawnTop", "dawnBottom"
            ],
        });

        material.backFaceCulling = false;
        this._mesh.material = material;

        this.initColors(material);

        Game.scene.onBeforeRenderObservable.add(() => {
            const secondsInCycle = 30;
            const time = performance.now() / 1000;
            const timeOfDay = (time % secondsInCycle) / secondsInCycle;
            material.setFloat("timeOfDay", timeOfDay);
        });
*/
    }

    private initColors(material: ShaderMaterial): void {
        material.setColor3("dayTop", new Color3(0.3, 0.78, 0.98));       // #3580d9
        material.setColor3("dayBottom", new Color3(1.0, 0.94, 0.80)); // bleu très clair avec un ton chaud

        material.setColor3("sunsetTop", new Color3(1.0, 0.69, 0.4));     // #ffb066 (anciennement #fff2ce)
        material.setColor3("sunsetBottom", new Color3(0.58, 0.55, 0.82)); // #938cd2

        material.setColor3("dawnTop", new Color3(0.65, 0.80, 1.0));      // Bleu clair doux #a6ccff
        material.setColor3("dawnBottom", new Color3(1.0, 0.69, 0.4));    // Orange doux #ffb066

        material.setColor3("nightTop", new Color3(0.043, 0.106, 0.212));    // #3a4a6b
        material.setColor3("nightBottom", new Color3(0.23, 0.29, 0.42)); // #0b1b36


    }



}