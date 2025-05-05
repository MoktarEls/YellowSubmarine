import {Engine, Scene} from "@babylonjs/core";
import {Sea} from "@/YellowSubmarine/Sea"

export class Game {

    private static _WorldScene : Scene;
    private static _Engine : Engine;

    public static get WorldScene(): Scene {
        return this._WorldScene;
    }
    public static get Engine(): Engine {
        return this._Engine;
    }

    private _sea : Sea | null = null;

    constructor(canvas: HTMLCanvasElement){
        Game._Engine = new Engine(canvas, true);
        Engine.ShadersRepository = "../shaders/";
        Game._WorldScene = new Scene(Game._Engine);
        this._sea = this.createSea();
        Game._Engine.runRenderLoop(() => {
            Game._WorldScene.render();
        })
    }

    private createSea() : Sea{
        return  new Sea();
/*
        const player = new Submarine(scene, this._engine);
        return scene;
*/
    }

}