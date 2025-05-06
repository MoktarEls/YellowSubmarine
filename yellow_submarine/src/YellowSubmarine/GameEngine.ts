import {Engine, EngineOptions, Nullable} from "@babylonjs/core";

export class GameEngine extends Engine{

    private static _instance: GameEngine;

    constructor(canvasOrContext: Nullable<HTMLCanvasElement | OffscreenCanvas | WebGLRenderingContext | WebGL2RenderingContext>,
                antialias?: boolean,
                options?: EngineOptions,
                adaptToDeviceRatio?: boolean) {
        super(canvasOrContext, antialias, options, adaptToDeviceRatio);
        GameEngine._instance = this;
    }

    static get instance(): GameEngine {
        return this._instance;
    }

    public static getDeltaTimeInSeconds(): number {
        return this._instance.getDeltaTime() / 1000;
    }

}