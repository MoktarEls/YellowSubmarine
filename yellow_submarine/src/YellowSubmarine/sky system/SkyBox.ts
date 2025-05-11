import {World} from "@/YellowSubmarine/World";
import {
    Color3,
    Mesh,
    MeshBuilder,
    Scene,
    ShaderMaterial, StandardMaterial, Vector3,
} from "@babylonjs/core";
import {Sun} from "@/YellowSubmarine/sky system/Sun";
import {Game} from "@/YellowSubmarine/Game";

export class SkyBox {

    public get mesh(): Mesh {
        return this._mesh;
    }

    private _mesh: Mesh;

    constructor(private _world: World) {
        this._mesh = new Mesh("");

    }

    public init(){
        this._mesh = MeshBuilder.CreateBox("skyBox", { size: 10000 }, this._world.scene);
        this._mesh.infiniteDistance = true;
        this._mesh.isPickable = false;

        const material = new ShaderMaterial("skyShader", this._world.scene, {
            vertex: "sky",
            fragment: "sky",
        }, {
            attributes: ["position"],
            uniforms: ["worldViewProjection", "sunDirection", "dayTopColor", "dayBottomColor", "sunsetColor", "horizonPower"],
        });

        material.backFaceCulling = false;
        this._mesh.material = material;

        // Set initial color parameters
        material.setColor3("dayTopColor", new Color3(0.2, 0.5, 0.9));      // Bleu clair
        material.setColor3("dayBottomColor", new Color3(0.8, 0.9, 1.0));   // Bleu pastel
        material.setColor3("sunsetColor", new Color3(1.0, 0.4, 0.1));      // Rouge/orange du coucher du soleil
        material.setFloat("horizonPower", 0);                             // Force du dégradé entre jour/nuit

        this._world.scene.onBeforeRenderObservable.add(() => {
            const sunDir = this._world._sky.sun._direction;
            material.setVector3("sunDirection", sunDir);
        });
    }



}