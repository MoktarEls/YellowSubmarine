import {Color3, Engine, Scene, ShaderMaterial, Vector3} from "@babylonjs/core";
import {WorldOld} from "@/YellowSubmarine/WorldOld";

export class GameOld {

    private static _world: WorldOld;
    private static _worldScene: Scene;
    private static _engine : Engine;
    private static _canvas: HTMLCanvasElement;


    public static get worldScene(): Scene {
        return this._worldScene;
    }
    public static get engine(): Engine {
        return this._engine;
    }
    public static get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public static get world(): WorldOld {
        return this._world;
    }

    constructor(canvas: HTMLCanvasElement){
        GameOld._canvas = canvas;
        GameOld._engine = new Engine(canvas, true);
        GameOld._worldScene = new Scene(GameOld._engine);
        Engine.ShadersRepository = "../shaders/";
        GameOld._world = new WorldOld(GameOld._worldScene);
        GameOld._world.initialize();

        const shader = new ShaderMaterial('shader', GameOld._worldScene, {
            vertex : "shader",
            fragment : "shader",
        }, {
            attributes: ['position', 'normal', 'uv'],
            uniforms: ['world', 'worldView', 'worldViewProjection'],
        })

        shader.setVector3('vLightPosition', GameOld._world.getSun().getPosition());
        shader.setVector3('vColor', new Vector3(0.5, 0.5, 0.5));

        GameOld._worldScene.meshes.forEach(mesh => {
            if (!(mesh.name === "sun" || mesh.name === "sunHalo" || mesh.name === "waterPlane")) {
                mesh.material = shader;
                console.log(mesh.name);
                //shader.setTexture('textureSampler', mesh.material.diffuseTexture);
            }
        })

        GameOld._engine.runRenderLoop(() => {
            WorldOld.scene.render()
        })
    }


}