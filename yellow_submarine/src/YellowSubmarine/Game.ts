import {Engine} from "@babylonjs/core";
import {World} from "@/YellowSubmarine/World";

export class Game {

    private _world: World;
    private static _engine : Engine;
    private static _canvas: HTMLCanvasElement;

    public static get engine(): Engine {
        return this._engine;
    }
    public static get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    constructor(canvas: HTMLCanvasElement){
        Game._canvas = canvas;
        Game._engine = new Engine(canvas, true);
        Engine.ShadersRepository = "../shaders/";

        this._world = new World();
        this._world.initialize();

        Game._engine.runRenderLoop(() => {
            World.scene.render()
        })
    }

}