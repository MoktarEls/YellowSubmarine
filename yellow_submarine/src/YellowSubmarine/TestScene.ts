import { Scene, Engine, FreeCamera, Vector3, Mesh, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import { Player } from "./Player";

export class Test {
    scene : Scene;
    engine : Engine;
    constructor(private canvas : HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scene = this.createScene();

        this.engine.runRenderLoop(() => {
            this.scene.render();
        })
    }

    createScene() : Scene {
        const scene = new Scene(this.engine);

        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), this.scene);
        hemiLight.intensity = 0.5;

        const ground = MeshBuilder.CreateGround("ground", {width:10, height:10}, this.scene);   

        const player = new Player(scene, this.engine);
        return scene;
    }
}