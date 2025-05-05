import {Engine} from "@babylonjs/core";
import {World} from "@/YellowSubmarine/World";

export class Game {
    private _world : World;
    private readonly _engine : Engine;

    constructor(canvas: HTMLCanvasElement){
        this._engine = new Engine(canvas, true);
        Engine.ShadersRepository = "../shaders/";
        this._world = new World(this._engine);
        this._engine.runRenderLoop(() => {
            this._world.scene.render();
        })
    }


/*    createWorldScene() : Scene {
        const scene = new Scene(this._engine);

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
            time += this._engine.getDeltaTime() * 0.0008;
            shaderMaterial.setFloat("time", time);
        });

        const waterPlane = MeshBuilder.CreateGround("waterPlane", {
            width: 20,
            height: 20,
            subdivisions: 64
        }, scene);

        waterPlane.material = shaderMaterial;

        const player = new Submarine(scene, this._engine);
        return scene;
    }*/
}