import {World} from "@/YellowSubmarine/World";
import {GameEngine} from "@/YellowSubmarine/GameEngine";
import {Engine, Scene} from "@babylonjs/core";

export class Game{

    public static get engine(): Engine {
        return this._gameEngine;
    }

    public static get scene(): Scene {
        return this._world;
    }

    private static _world: World;
    private static _gameEngine: GameEngine;

    constructor(canvas: HTMLCanvasElement) {
        Game._gameEngine = new GameEngine(canvas);
        Game._world = new World();
        Game._world.initialize();
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