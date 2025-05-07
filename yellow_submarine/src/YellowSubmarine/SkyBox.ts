import {World} from "@/YellowSubmarine/World";
import {Color3, CubeTexture, Mesh, MeshBuilder, Scene, StandardMaterial, Texture} from "@babylonjs/core";

export class SkyBox {
    public get mesh(): Mesh {
        return this._mesh;
    }

    private _mesh: Mesh;

    constructor(private _world: World) {
        this._mesh = new Mesh("");
    }

    public init(){
        this._mesh = this.createSkybox(this._world.scene);
    }

    private createSkybox(scene: Scene) {
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 5000 }, scene);
        skybox.infiniteDistance = true;

        const skyboxMaterial = new StandardMaterial("skyBoxMaterial", scene);
        skyboxMaterial.backFaceCulling = false;

        const cubeTexture = CubeTexture.CreateFromImages([
            "/textures/skybox/nz.png",
            "/textures/skybox/py.png",
            "/textures/skybox/px.png",
            "/textures/skybox/pz.png",
            "/textures/skybox/ny.png",
            "/textures/skybox/nx.png",
        ], scene);
        cubeTexture.coordinatesMode = Texture.SKYBOX_MODE;

        skyboxMaterial.reflectionTexture = cubeTexture;
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;

        return skybox;
    }


}