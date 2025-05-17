import {NPC} from "@/YellowSubmarine/npcs/NPC";
import {MeshBuilder, Vector3} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";
import {SphericDetectionZone} from "@/YellowSubmarine/detection system/SphericDetectionZone";
import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";

export class NPCFactory {

    public static createPedro(): NPC{
        const pedro = new NPC();
        pedro.name = "Pedro";
        pedro.mesh = MeshBuilder.CreateBox("npcBody", {
            height: 5,
            width: 1,
            depth: 1,
        },Game.scene);

        pedro.mesh.position = new Vector3(-10, 0, -2);
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