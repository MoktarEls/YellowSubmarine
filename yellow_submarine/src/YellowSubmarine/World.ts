import {
    Color3,
    CubeTexture, DirectionalLight,
    Engine,
    HemisphericLight, Mesh,
    MeshBuilder,
    Scene,
    ShaderMaterial, ShadowGenerator,
    StandardMaterial,
    Texture,
    Vector3
} from "@babylonjs/core";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {Game} from "@/YellowSubmarine/Game";

export class World{

    constructor() {
        this.createSunLight();
        this.createSea();
        this.createSubmarine();
        this.createSkyBox();
    }

    private createSunLight() {
        const sun = MeshBuilder.CreateSphere("sun", {
            diameter: 40,
            segments: 32
        }, Game.worldScene);
        sun.position = new Vector3(1000, 100, -1000);
        sun.infiniteDistance = true;
        sun.isPickable = false;

        const sunMaterial = new StandardMaterial("sunMat", Game.worldScene);
        sunMaterial.emissiveColor = new Color3(1.0, 1.0, 1.0);
        sunMaterial.diffuseColor = Color3.Black();
        sunMaterial.specularColor = Color3.Black();

        sun.material = sunMaterial;

        const halo = MeshBuilder.CreateSphere("sunHalo", {
            diameter: 46,
            segments: 32
        }, Game.worldScene);
        halo.position = sun.position.clone();
        halo.infiniteDistance = true;
        halo.isPickable = false;

        const haloMaterial = new StandardMaterial("haloMat", Game.worldScene);
        haloMaterial.emissiveColor = new Color3(1.0, 1.0, 1.0);
        haloMaterial.diffuseColor = Color3.Black();
        haloMaterial.specularColor = Color3.Black();
        haloMaterial.alpha = 0.6

        halo.material = haloMaterial;

        const light = new DirectionalLight("sunLight", new Vector3(-1, -2, 1), Game.worldScene);
        light.position = sun.position.clone();
        light.intensity = 1.0;
        light.shadowEnabled = true;

        const hemiLight = new HemisphericLight("hemiLight", new Vector3(-1, -2, 1), Game.worldScene);
        hemiLight.intensity = 0.5;
        hemiLight.shadowEnabled = false;
    }

    private createSea() {
        const shaderMaterial = new ShaderMaterial("waterShader", Game.worldScene, {
            vertex: "water",
            fragment: "water"
        }, {
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection", "time"],
            samplers: ["noiseTexture"]
        });

        const noiseTexture = new Texture("/textures/noiseTexture.png", Game.worldScene);
        shaderMaterial.setTexture("noiseTexture", noiseTexture);

        let time = 0;
        Game.worldScene.registerBeforeRender(() => {
            time += Game.engine.getDeltaTime() * 0.0008;
            shaderMaterial.setFloat("time", time);
        });

        const waterPlane = MeshBuilder.CreateGround("waterPlane", {
            width: 20,
            height: 20,
            subdivisions: 64
        }, Game.worldScene);

        waterPlane.material = shaderMaterial;
    }

    private createSubmarine() {
        new Submarine();
    }

    private createSkyBox() {
        const skybox = MeshBuilder.CreateBox("skyBox", {size:10000}, Game.worldScene);
        skybox.infiniteDistance = true;

        const skyboxMaterial = new StandardMaterial("skyBoxMaterial", Game.worldScene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;

        skyboxMaterial.reflectionTexture = CubeTexture.CreateFromImages([
            "/textures/skybox/nz.png", //1
            "/textures/skybox/py.png", //2
            "/textures/skybox/px.png", //3
            "/textures/skybox/pz.png", //4
            "/textures/skybox/ny.png", //5
            "/textures/skybox/nx.png", //6
        ], Game.worldScene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;

        skybox.material = skyboxMaterial;
    }
}