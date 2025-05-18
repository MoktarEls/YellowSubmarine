import {NPC} from "@/YellowSubmarine/npcs/NPC";
import {LoadAssetContainerAsync, MeshBuilder, SceneLoader, Vector3} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {SphericDetectionZone} from "@/YellowSubmarine/detection system/SphericDetectionZone";
import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";

export class NPCFactory {

    public static async createPedro(): Promise<NPC>{
        const pedro = new NPC();
        pedro.name = "Pedro";
        const assets = await LoadAssetContainerAsync("/models/characters/pedroBaked.glb", Game.scene);
        pedro.mesh = assets.meshes[0];
        pedro.detectionZone = new SphericDetectionZone(3, true);

        // for test purpose
        const conversation = new Conversation();
        const dialogue1 = new SimpleDialogueNode();
        dialogue1.text = "Hello";
        const dialogue2 = new SimpleDialogueNode();
        dialogue2.text = "Bye";
        dialogue1.nextNode = dialogue2;
        conversation.root = dialogue1;
        pedro.conversation = conversation;

        return pedro;
    }
}