import {World} from "@/YellowSubmarine/World";
import {Engine, Scene} from "@babylonjs/core";

export class Game{

    private static _instance: Game;

    private _scene: Scene;
    private _engine: Engine;
    private _world: World;
    private _isPointerLocked = false;

    public get scene(): Scene {
        return this._scene;
    }

    public get engine(): Engine{
        return this._engine;
    }

    public static get engine(): Engine {
        return Game._instance.engine;
    }

    public static get scene(): Scene {
        return Game._instance.scene;
    }

    constructor(private _canvas: HTMLCanvasElement) {
        Game._instance = this;
        this._engine = new Engine(this._canvas);
        this._scene = new Scene(this._engine);
        this.engine.runRenderLoop(() => {
            this.scene.render();
        })
        this._world = new World(this._scene);

        if (_canvas) {
            _canvas.addEventListener("click", () => {
                _canvas.requestPointerLock();
            });
            document.addEventListener("pointerlockchange", () => {
                this._isPointerLocked = document.pointerLockElement === _canvas;
            });
        }

    }



}