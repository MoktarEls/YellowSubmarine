import {
    ActionManager,
    CubeTexture,
    HemisphericLight,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Texture,
    Vector3
} from "@babylonjs/core";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {Sun} from "@/YellowSubmarine/Sun";
import {Sea} from "@/YellowSubmarine/Sea";
import {Game} from "@/YellowSubmarine/Game";

export class World{

    private static _scene: Scene;

    public static get scene(): Scene {
        return this._scene;
    }

    private readonly _sun : Sun;

    constructor(scene: Scene) {
        World._scene = scene;
        World._scene.actionManager = new ActionManager();
        this._sun = this.createSun();
    }

    public initialize() {
        this.createHemisphericLight();
        this.createSea();
        this.createSubmarine();
        //this.createSkyBox();
    }

    private createHemisphericLight(){
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), World.scene);
        hemiLight.intensity = 0.5;
    }

    private createSea() {
        new Sea();
    }

    private createSubmarine() {
        new Submarine();
    }

    private createSun(): Sun {
        return new Sun();
    }

    public getSun(): Sun{
        return this._sun;
    }

    private createSkyBox() {
        const skybox = MeshBuilder.CreateBox("skyBox", {size:2000}, World.scene);
        skybox.infiniteDistance = true;

        const skyboxMaterial = new StandardMaterial("skyBoxMaterial", World.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;

        skyboxMaterial.reflectionTexture = CubeTexture.CreateFromImages([
            "/textures/skybox/nz.png", //1
            "/textures/skybox/py.png", //2
            "/textures/skybox/px.png", //3
            "/textures/skybox/pz.png", //4
            "/textures/skybox/ny.png", //5
            "/textures/skybox/nx.png", //6
        ], World.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;

        skybox.material = skyboxMaterial;
    }
}