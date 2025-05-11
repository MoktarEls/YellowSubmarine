import {World} from "@/YellowSubmarine/World";
import {
    Color3,
    Mesh,
    MeshBuilder,
    ShaderMaterial
} from "@babylonjs/core";


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
            uniforms: [
                "worldViewProjection", "timeOfDay",
                "dayTop", "dayBottom",
                "sunsetTop", "sunsetBottom",
                "nightStartTop", "nightStartBottom",
                "nightTop", "nightBottom",
                "dawnTop", "dawnBottom"
            ],
        });

        material.backFaceCulling = false;
        this._mesh.material = material;

        this.initColors(material);

        this._world.scene.onBeforeRenderObservable.add(() => {
            const secondsInCycle = 30;
            const time = performance.now() / 1000;
            const timeOfDay = (time % secondsInCycle) / secondsInCycle;
            material.setFloat("timeOfDay", timeOfDay);
        });
    }

    private initColors(material: ShaderMaterial): void {

        material.setColor3("dayTop", new Color3(0.2, 0.5, 0.9));        // Bleu ciel
        material.setColor3("dayBottom", new Color3(0.8, 0.9, 1.0));     // Presque blanc

        material.setColor3("sunsetTop", new Color3(0.2, 0.3, 0.6));     // Bleu foncé atténué
        material.setColor3("sunsetBottom", new Color3(1.0, 0.4, 0.1));  // Orange vif

        material.setColor3("nightStartTop", new Color3(0.1, 0.05, 0.2));    // Violet sombre
        material.setColor3("nightStartBottom", new Color3(0.02, 0.02, 0.1)); // Bleu nuit

        material.setColor3("nightTop", new Color3(0.01, 0.01, 0.08));       // Presque noir
        material.setColor3("nightBottom", new Color3(0.02, 0.03, 0.12));    // Très sombre, mais un poil plus clair

        material.setColor3("dawnTop", new Color3(1.0, 0.5, 0.3));        // Orange rosé
        material.setColor3("dawnBottom", new Color3(0.3, 0.4, 0.7));     // Bleu froid qui revient


    }



}