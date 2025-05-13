import {World} from "@/YellowSubmarine/World";
import {Engine, Scene} from "@babylonjs/core";
import {Player} from "@/YellowSubmarine/Player";
import {PlayerCamera} from "@/YellowSubmarine/camera system/PlayerCamera";

export class Game{

    private static _instance: Game;

    private _scene: Scene;
    private _engine: Engine;
    private _world: World;
    private _player: Player;
    private _isPointerLocked = false;
    private _playerCamera: PlayerCamera;

    public static get engine(): Engine {
        return Game._instance._engine;
    }

    public static get scene(): Scene {
        return Game._instance._scene;
    }

    constructor(private _canvas: HTMLCanvasElement) {
        Game._instance = this;
        this._engine = new Engine(this._canvas);
        this._scene = new Scene(this._engine);
        this._playerCamera = new PlayerCamera();
        this._world = new World();
        this._player = new Player();
        if (_canvas) {
            _canvas.addEventListener("click", () => {
                _canvas.requestPointerLock();
            });
            document.addEventListener("pointerlockchange", () => {
                this._isPointerLocked = document.pointerLockElement === _canvas;
            });
        }
        this._engine.runRenderLoop(() => {
            this._scene.render();
        })
    }



}