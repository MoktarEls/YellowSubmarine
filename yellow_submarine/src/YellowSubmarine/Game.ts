import {World} from "@/YellowSubmarine/World";
import {GameEngine} from "@/YellowSubmarine/GameEngine";
import {Engine, Scene} from "@babylonjs/core";
import {MouseMovementEventManager} from "@/YellowSubmarine/event managers/MouseMovementEventManager";
import {KeyboardEventManager} from "@/YellowSubmarine/event managers/KeyboardEventManager";

export class Game{

    public get scene(): Scene {
        return this._world.scene;
    }

    public get engine(): Engine {
        return this._gameEngine.engine;
    }

    public static get engine(): Engine {
        return Game._instance.engine;
    }

    public static get scene(): Scene {
        return Game._instance.scene;
    }

    private static _instance: Game;

    private _world: World;
    private _gameEngine: GameEngine;
    private _mouseMovementEventManager: MouseMovementEventManager;
    private _keyboardEventManager: KeyboardEventManager;

    private _isPointerLocked = false;

    constructor(private _canvas: HTMLCanvasElement) {
        Game._instance = this;
        this._mouseMovementEventManager = new MouseMovementEventManager(Game._instance);
        this._keyboardEventManager = new KeyboardEventManager(Game._instance);
        this._gameEngine = new GameEngine(Game._instance, _canvas);
        this._world = new World(Game._instance);
    }

    public init(){
        this.handlePointerLocking(this._canvas);
        this._mouseMovementEventManager.init();
        this._keyboardEventManager.init();
        this._gameEngine.init();
        this._world.init();
        this.startRendering()
    }

    private startRendering(){
        this.engine.runRenderLoop(() => {
            this.scene.render();
        })
    }


    public static registerUpdateAction(
        action: (deltaTimeInSeconds: number) => void,
        context?: any
    ){
        const boundAction = context ? action.bind(context) : action;
        this.scene.onBeforeRenderObservable.add(() => {
            boundAction(GameEngine.getDeltaTimeInSeconds());
        })
    }

    public isPointerLocked(): boolean {
        return this._isPointerLocked;
    }

    private handlePointerLocking(canvas: HTMLCanvasElement) {
        if (canvas) {
            canvas.addEventListener("click", () => {
                canvas.requestPointerLock();
            });
            document.addEventListener("pointerlockchange", () => {
                this._isPointerLocked = document.pointerLockElement === canvas;
            });
        }
    }

}