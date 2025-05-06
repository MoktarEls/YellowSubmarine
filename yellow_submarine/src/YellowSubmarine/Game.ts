import {Color3, Engine, Scene, ShaderMaterial, Vector3} from "@babylonjs/core";
import {World} from "@/YellowSubmarine/World";

export class Game {

    private static _world: World;
    private static _worldScene: Scene;
    private static _engine : Engine;


    public static get worldScene(): Scene {
        return this._worldScene;
    }
    public static get engine(): Engine {
        return this._engine;
    }

    public static get world(): World {
        return this._world;
    }

    constructor(canvas: HTMLCanvasElement){
        Game._engine = new Engine(canvas, true);
        Game._worldScene = new Scene(Game.engine)
        Engine.ShadersRepository = "../shaders/";
        Game._world = new World();
        Game._world.initialize();

        const shader = new ShaderMaterial('shader', Game._worldScene, {
            vertex : "shader",
            fragment : "shader",
        }, {
            attributes: ['position', 'normal', 'uv'],
            uniforms: ['world', 'worldView', 'worldViewProjection'],
        })

        shader.setVector3('vLightPosition', Game._world.getSun().getPosition());
        shader.setVector3('vColor', new Vector3(0.5, 0.5, 0.5));

        Game._worldScene.meshes.forEach(mesh => {
            if (!(mesh.name === "sun" || mesh.name === "sunHalo" || mesh.name === "waterPlane")) {
                mesh.material = shader;
                console.log(mesh.name);
                //shader.setTexture('textureSampler', mesh.material.diffuseTexture);
            }
        })

        Game._engine.runRenderLoop(() => {
            Game.worldScene.render();
        })
    }


}