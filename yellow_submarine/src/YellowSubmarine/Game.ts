import {World} from "@/YellowSubmarine/World";
import {Engine, Observable, Scene} from "@babylonjs/core";
import {Player} from "@/YellowSubmarine/Player";
import {PlayerCamera} from "@/YellowSubmarine/camera system/PlayerCamera";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";
import {UIManager} from "@/YellowSubmarine/ui system/UIManager";

export class Game{

    private static _instance: Game;

    public static onGameFocusChange: Observable<boolean> = new Observable<boolean>();

    private _scene: Scene;
    private _engine: Engine;
    private _world: World;
    private _player: Player;
    private _isGameFocused = false;
    private _playerCamera: PlayerCamera;
    private _interactionManager: InteractionManager;
    private _uiManager: UIManager;

    public static get canvas(){
        return this._instance._canvas;
    }

    public static get engine(): Engine {
        return Game._instance._engine;
    }

    public static get scene(): Scene {
        return Game._instance._scene;
    }

    public static get uiManager(): UIManager {
        return Game._instance._uiManager;
    }

    public static get isGameFocused(): boolean {
        return Game._instance._isGameFocused;
    }

    constructor(private _canvas: HTMLCanvasElement) {
        Game._instance = this;
        this._engine = new Engine(this._canvas);
        this._scene = new Scene(this._engine);
        this._interactionManager = new InteractionManager();
        this._playerCamera = new PlayerCamera();
        this._world = new World();
        this._player = new Player();
        this._uiManager = new UIManager();
        if (_canvas) {
            _canvas.addEventListener("click", () => {
                if(!this._isGameFocused) {
                    _canvas.requestPointerLock();
                }
            });
            document.addEventListener("pointerlockchange", () => {
                this.updateFocusState(document.pointerLockElement === _canvas);
            });
        }
        this._engine.runRenderLoop(() => {
            this._scene.render();
        })
        window.addEventListener("resize", () => this._engine.resize() );
    }

    private updateFocusState(state: boolean) {
        if(state != this._isGameFocused){
            this._isGameFocused = state;
            Game.onGameFocusChange.notifyObservers(this._isGameFocused);
        }
    }



}