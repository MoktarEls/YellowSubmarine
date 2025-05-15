import {AbstractMesh, MeshBuilder, Vector3} from "@babylonjs/core";
import {MeshDetectionZone} from "@/YellowSubmarine/detection system/MeshDetectionZone";
import {Game} from "@/YellowSubmarine/Game";
import {SphericDetectionZone} from "@/YellowSubmarine/detection system/SphericDetectionZone";
import {NPC} from "@/YellowSubmarine/NPC";
import {IslandInteraction} from "@/YellowSubmarine/interaction system/interactions/IslandInteraction";
import {World} from "@/YellowSubmarine/World";

export class Island {

    private _mesh: AbstractMesh;
    private _name = "Daulphin Island !";
    private _islandInteraction: IslandInteraction;
    private _islandDetectionZone: MeshDetectionZone;
    private _npc: NPC;

    constructor(){

        this._npc = new NPC();
        this._islandInteraction = new IslandInteraction(this._name);

        this._mesh = MeshBuilder.CreateBox("island", {
            height: 20,
            width: 10,
            depth: 10,
        }, Game.scene);

        this._mesh.position = new Vector3(0, 0, -50);

        this._islandDetectionZone = new SphericDetectionZone(20, true);
        this._islandDetectionZone.zone.parent = this._mesh;

        this._islandDetectionZone.onMeshEnter.add( () => {
            if(this._islandInteraction)
                this._islandInteraction.makeAvailable();
        });

        this._islandDetectionZone.onMeshExit.add( () => {
            if(this._islandDetectionZone)
                this._islandInteraction.makeUnavailable();
        });

        World.submarine.meshCreationPromise.then((mesh: AbstractMesh) => {
            this._islandDetectionZone.addMeshToDetect(mesh);
        })

    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get npc(): NPC {
        return this._npc;
    }

}