import {Engine, Scene} from "@babylonjs/core";
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
        Game._engine.runRenderLoop(() => {
            Game.worldScene.render();
        })
    }

}