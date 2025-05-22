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
        dialogue1.text = "Ceci est un texte en [g]gras[/g]";

        const dialogue2 = new SimpleDialogueNode();
        dialogue2.text = "Ceci est un texte en [i]italique[/i]";

        dialogue1.nextNode = dialogue2;
        const dialogue3 = new SimpleDialogueNode();
        dialogue3.text = "Ceci est un texte en [g][c=blue]gras et bleu[/c][/g].";

        dialogue2.nextNode = dialogue3;
        const dialogue4 = new SimpleDialogueNode();
        dialogue4.text = "Voici un mot en [g]gras[/g], un en [i]italique[/i], et un [g][c=#ffffff]gras rouge.[/c][/g] Il y a beaucoup de texte";
        dialogue3.nextNode = dialogue4;

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