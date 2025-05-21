import {NPC} from "@/YellowSubmarine/npcs/NPC";
import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";
import {Utils} from "@/YellowSubmarine/Utils";
import {CylindricalDetectionZone} from "@/YellowSubmarine/detection system/CylindricalDetectionZone";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {Angle, Vector3} from "@babylonjs/core";

export class NPCFactory {

    public static async createPedro(): Promise<NPC>{
        const pedro = new NPC();
        pedro.name = "Pedro";
        Utils.loadMesh("models/characters/pedro.glb").then( (result) => {
            pedro.mesh = result.meshes[0];
        });
        pedro.detectionZone = new CylindricalDetectionZone( {
            height: 8,
            diameterTop: 45,
            diameterBottom: 45,
        }, true);

        pedro.detectionZone.zone.position.set(0, -11, 0);

        // for test purpose
        const conversation = new Conversation();
        const dialogue1 = new SimpleDialogueNode();
        dialogue1.text = "Hello ! This is a text that needs to show upFDSQFDSOIJFODISJFOIDSJFIODSJIOFJDSIOJFDSIOJFDIOSJFIODSJIOFDSJIOFJSD";
        const dialogue2 = new SimpleDialogueNode();
        dialogue2.text = "Hi ! This is a second text ";
        dialogue1.nextNode = dialogue2;
        conversation.root = dialogue1;
        pedro.conversation = conversation;

        pedro.cameraConfiguration = new CameraConfiguration();
        pedro.cameraConfiguration.target = pedro.transformNode;
        pedro.cameraConfiguration.distanceFromTarget = 10;
        pedro.cameraConfiguration.offset = Vector3.Up().scale(2);
        pedro.cameraConfiguration.wantedAlpha = Angle.FromDegrees(-90).radians();


        return pedro;
    }
}