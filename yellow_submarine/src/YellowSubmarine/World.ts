import {
    CubeTexture,
    Engine,
    HemisphericLight,
    MeshBuilder,
    Scene,
    ShaderMaterial,
    StandardMaterial,
    Texture,
    Vector3
} from "@babylonjs/core";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {Game} from "@/YellowSubmarine/Game";

export class World{

    constructor() {
        this.createHemisphericLight();
        this.createSea();
        this.createSubmarine();
        this.createSkyBox();
    }

    private createHemisphericLight(){
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), Game.worldScene);
        hemiLight.intensity = 0.5;
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
        const skybox = MeshBuilder.CreateBox("skyBox", {size:2000}, Game.worldScene);
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