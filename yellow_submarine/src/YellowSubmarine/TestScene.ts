import { Scene, Engine, Vector3, HemisphericLight, Texture, ShaderMaterial, MeshBuilder} from "@babylonjs/core";
import { Player } from "./Player";

export class Test {
    scene : Scene;
    engine : Engine;
    constructor(private canvas : HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.createScene();
        Engine.ShadersRepository = "../shaders/";
        this.engine.runRenderLoop(() => {
            this.scene.render();
        })
    }

    createScene() : Scene {
        const scene = new Scene(this.engine);

        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), this.scene);
        hemiLight.intensity = 0.5;

        const shaderMaterial = new ShaderMaterial("waterShader", scene, {
            vertex: "water",
            fragment: "water"
        }, {
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection", "time"],
            samplers: ["noiseTexture"]
        });

        const noiseTexture = new Texture("/textures/noiseTexture.png", scene);
        shaderMaterial.setTexture("noiseTexture", noiseTexture);

        let time = 0;
        scene.registerBeforeRender(() => {
            time += this.engine.getDeltaTime() * 0.0008;
            shaderMaterial.setFloat("time", time);
        });

        const waterPlane = MeshBuilder.CreateGround("waterPlane", {
            width: 20,
            height: 20,
            subdivisions: 64
        }, scene);

        waterPlane.material = shaderMaterial;

        const player = new Player(scene, this.engine);
        return scene;
    }
}