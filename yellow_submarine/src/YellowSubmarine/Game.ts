import {Engine, Scene} from "@babylonjs/core";
import {World} from "@/YellowSubmarine/World";
import {InputManager} from "@/YellowSubmarine/InputManager";

export class Game {

    private _world: World;
    private _inputManager: InputManager;
    private static _engine : Engine;

    public static get engine(): Engine {
        return this._engine;
    }

    constructor(canvas: HTMLCanvasElement){
        Game._engine = new Engine(canvas, true);
        Engine.ShadersRepository = "../shaders/";
        this._world = new World();
        this._world.initialize();
        this._inputManager = new InputManager();
        Game._engine.runRenderLoop(() => {
            World.scene.render()
        })
    }

}