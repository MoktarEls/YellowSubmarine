import {Engine, HemisphericLight, MeshBuilder, Scene, ShaderMaterial, Texture, Vector3} from "@babylonjs/core";
import {Submarine} from "@/YellowSubmarine/Submarine";

export class World{

    private _scene: Scene;
    private _engine: Engine;
    private _submarine: Submarine | null = null;

    public get scene(): Scene {
        return this._scene;
    }

    constructor(engine: Engine) {
        this._engine = engine;
        this._scene = new Scene(this._engine);
        this.createHemisphericLight();
        this.createSea();
        this.createSubmarine();
    }

    private createHemisphericLight(){
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), this._scene);
        hemiLight.intensity = 0.5;
    }

    private createSea() {
        const shaderMaterial = new ShaderMaterial("waterShader", this._scene, {
            vertex: "water",
            fragment: "water"
        }, {
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection", "time"],
            samplers: ["noiseTexture"]
        });

        const noiseTexture = new Texture("/textures/noiseTexture.png", this._scene);
        shaderMaterial.setTexture("noiseTexture", noiseTexture);

        let time = 0;
        this._scene.registerBeforeRender(() => {
            time += this._engine.getDeltaTime() * 0.0008;
            shaderMaterial.setFloat("time", time);
        });

        const waterPlane = MeshBuilder.CreateGround("waterPlane", {
            width: 20,
            height: 20,
            subdivisions: 64
        }, this._scene);

        waterPlane.material = shaderMaterial;
    }

    private createSubmarine() {
        this._submarine = new Submarine();
    }
}