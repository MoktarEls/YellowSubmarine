import {World} from "@/YellowSubmarine/World";
import {GameEngine} from "@/YellowSubmarine/GameEngine";
import {Engine, Scene} from "@babylonjs/core";

export class Game{

    public static get engine(): Engine {
        return Game._instance._gameEngine;
    }

    public static get scene(): Scene {
        return Game._instance._world;
    }

    private static _instance: Game;

    private _world: World;
    private _gameEngine: GameEngine;

    constructor(canvas: HTMLCanvasElement) {
        Game._instance = this;
        this._gameEngine = new GameEngine(canvas);
        this._world = new World();
        this._world.initialize();
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

}