import {Engine, EngineOptions, Nullable} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export class GameEngine {

    public get engine(): Engine {
        return this._engine;
    }

    private static _instance: GameEngine;
    private _engine: Engine;

    constructor(
        private _game: Game,
        canvasOrContext: Nullable<HTMLCanvasElement | OffscreenCanvas | WebGLRenderingContext | WebGL2RenderingContext>,
        antialias?: boolean,
        options?: EngineOptions,
        adaptToDeviceRatio?: boolean
    )
    {
        this._engine = new Engine(canvasOrContext, antialias, options, adaptToDeviceRatio);
        GameEngine._instance = this;
    }

    public init(){
        return;
    }

    public static getDeltaTimeInSeconds(): number {
        return this._instance._engine.getDeltaTime() / 1000;
    }

}