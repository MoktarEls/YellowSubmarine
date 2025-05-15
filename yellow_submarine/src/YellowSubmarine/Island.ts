import {AbstractMesh, Mesh, SceneLoader, StandardMaterial, Vector3,} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {SphericDetectionZone} from "@/YellowSubmarine/detection system/SphericDetectionZone";
import {NPC} from "@/YellowSubmarine/NPC";
import {World} from "@/YellowSubmarine/World";
import {UIManager} from "@/YellowSubmarine/ui system/UIManager";
import {IslandKeyZone} from "@/YellowSubmarine/KeyZone/IslandKeyZone";

export class Island extends IslandKeyZone{

    private _mesh!: AbstractMesh;
    private _npc: NPC;

    constructor(){

        super("Dolphin island",
            false,
            new SphericDetectionZone(20, true));

        this._npc = new NPC();

        this.createMesh().then( () => {
            this._detectionZone.zone.parent = this._mesh;

            this.detectionZone.onMeshEnter.add( () => {
                UIManager.instance.islandUI.show(this._name, this.discovered);
                if(!this._discovered){
                    this._discovered = true;
                }

            });

            World.submarine.meshCreationPromise.then((mesh: AbstractMesh) => {
                this.detectionZone.addMeshToDetect(mesh);
            })
        });

    }


    public set name(value: string) {
        this._name = value;
    }

    public get npc(): NPC {
        return this._npc;
    }

    private async createMesh() {
        const result = await SceneLoader.ImportMeshAsync("", "models/", "dolphinIsland.glb", Game.scene);
        this._mesh = result.meshes[0] as Mesh;
        this._mesh.name = "dolphinIsland";
        this._mesh.position = new Vector3(0,0, -30)
        this._mesh.material = new StandardMaterial("submarineMaterial", Game.scene);
    }

}