import {Engine, Scene} from "@babylonjs/core";
import {Sea} from "@/YellowSubmarine/Sea"
import {Submarine} from "@/YellowSubmarine/Submarine";

export class Game {

    private static _WorldScene : Scene;
    private static _Engine : Engine;

    public static get WorldScene(): Scene {
        return this._WorldScene;
    }
    public static get Engine(): Engine {
        return this._Engine;
    }

    private _sea : Sea;
    private _submarine : Submarine;

    constructor(canvas: HTMLCanvasElement){
        Game._Engine = new Engine(canvas, true);
        Engine.ShadersRepository = "../shaders/";
        Game._WorldScene = new Scene(Game._Engine);
        this._sea = this.createSea();
        this._submarine = this.createSubmarine();
        Game._Engine.runRenderLoop(() => {
            Game._WorldScene.render();
        })
    }

    private createSea() : Sea{
        return new Sea();
    }


    private createSubmarine() {
        return new Submarine();
    }
}