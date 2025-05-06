import {World} from "@/YellowSubmarine/World";
import {GameEngine} from "@/YellowSubmarine/GameEngine";

export class Game{

    private static _world: World;
    private static _gameEngine: GameEngine;

    constructor(canvas: HTMLCanvasElement) {
        Game._gameEngine = new GameEngine(canvas);
        Game._world = new World(Game._gameEngine);
    }

    public static registerUpdateAction(
        action: (deltaTimeInSeconds: number) => void,
        context?: any
    ){
        const boundAction = context ? action.bind(context) : action;
        this._world.onBeforeRenderObservable.add(() => {
            boundAction(GameEngine.getDeltaTimeInSeconds());
        })
    }

}