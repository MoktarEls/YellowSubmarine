import {World} from "@/YellowSubmarine/World";
import {
    Mesh,
    MeshBuilder,
    Scene,
    ShaderMaterial,
} from "@babylonjs/core";
import {Sun} from "@/YellowSubmarine/sky system/Sun";

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
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 10000.0 }, scene);
        skybox.infiniteDistance = true;

        const skyMaterial = new ShaderMaterial("sky", scene, {
            vertex: "sky",
            fragment: "sky",
        }, {
            attributes: ["position"],
            uniforms: ["worldViewProjection", "sunDirection", "time"]
        });
        this._world.scene.registerBeforeRender(() => {
            skyMaterial.setVector3("sunDirection", Sun._instance._direction);
        });
        skyMaterial.backFaceCulling = false;
        skybox.material = skyMaterial;

        return skybox;
    }


}