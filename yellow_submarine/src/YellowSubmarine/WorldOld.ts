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
import {SubmarineOld} from "@/YellowSubmarine/SubmarineOld";
import {SunOld} from "@/YellowSubmarine/SunOld";
import {SeaOld} from "@/YellowSubmarine/SeaOld";
import {GameOld} from "@/YellowSubmarine/GameOld";

export class WorldOld {

    private static _scene: Scene;

    public static get scene(): Scene {
        return this._scene;
    }

    private readonly _sun : SunOld;

    constructor(scene: Scene) {
        WorldOld._scene = scene;
        WorldOld._scene.actionManager = new ActionManager();
        this._sun = this.createSun();
    }

    public initialize() {
        this.createHemisphericLight();
        this.createSea();
        this.createSubmarine();
        //this.createSkyBox();
    }

    private createHemisphericLight(){
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), WorldOld.scene);
        hemiLight.intensity = 0.5;
    }

    private createSea() {
        new SeaOld();
    }

    private createSubmarine() {
        new SubmarineOld();
    }

    private createSun(): SunOld {
        return new SunOld();
    }

    public getSun(): SunOld{
        return this._sun;
    }

    private createSkyBox() {
        const skybox = MeshBuilder.CreateBox("skyBox", {size:2000}, WorldOld.scene);
        skybox.infiniteDistance = true;

        const skyboxMaterial = new StandardMaterial("skyBoxMaterial", WorldOld.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;

        skyboxMaterial.reflectionTexture = CubeTexture.CreateFromImages([
            "/textures/skybox/nz.png", //1
            "/textures/skybox/py.png", //2
            "/textures/skybox/px.png", //3
            "/textures/skybox/pz.png", //4
            "/textures/skybox/ny.png", //5
            "/textures/skybox/nx.png", //6
        ], WorldOld.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;

        skybox.material = skyboxMaterial;
    }
}