import {World} from "@/YellowSubmarine/World";
import {GameEngine} from "@/YellowSubmarine/GameEngine";
import {Engine, Scene} from "@babylonjs/core";

export class Game{

    public static get engine(): Engine {
        return this._gameEngine;
    }

    public static get scene(): Scene {
        return this._scene;
    }

    private static _scene: World;
    private static _gameEngine: GameEngine;

    constructor(canvas: HTMLCanvasElement) {
        Game._gameEngine = new GameEngine(canvas);
        Game._scene = new World(Game._gameEngine);
    }

    public static registerUpdateAction(
        action: (deltaTimeInSeconds: number) => void,
        context?: any
    ){
        const boundAction = context ? action.bind(context) : action;
        this._scene.onBeforeRenderObservable.add(() => {
            boundAction(GameEngine.getDeltaTimeInSeconds());
        })
    }

}