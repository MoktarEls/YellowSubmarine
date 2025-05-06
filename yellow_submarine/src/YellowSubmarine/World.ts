import {
    CubeTexture,
    MeshBuilder,
    StandardMaterial,
    Texture,
} from "@babylonjs/core";
import {Submarine} from "@/YellowSubmarine/Submarine";
import {Sun} from "@/YellowSubmarine/Sun";
import {Sea} from "@/YellowSubmarine/Sea";
import {Game} from "@/YellowSubmarine/Game";

export class World{

    private readonly _sun : Sun;

    constructor() {
        this._sun = this.createSun();
        this.createSubmarine();
        //this.createSkyBox();
    }

    public initialize(){
        this.createSea();
    }

    private createSun(): Sun {
        return new Sun();
    }

    private createSea() {
        new Sea();
    }

    private createSubmarine() {
        new Submarine();
    }

    public getSun(): Sun{
        return this._sun;
    }

    private createSkyBox() {
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 10000 }, Game.worldScene);
        skybox.infiniteDistance = true;

        const skyboxMaterial = new StandardMaterial("skyBoxMaterial", Game.worldScene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;

        skyboxMaterial.reflectionTexture = CubeTexture.CreateFromImages([
            "/textures/skybox/nz.png",
            "/textures/skybox/py.png",
            "/textures/skybox/px.png",
            "/textures/skybox/pz.png",
            "/textures/skybox/ny.png",
            "/textures/skybox/nx.png",
        ], Game.worldScene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;

        skybox.material = skyboxMaterial;
    }
}