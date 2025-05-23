import {NPC} from "@/YellowSubmarine/npcs/NPC";
import {Utils} from "@/YellowSubmarine/Utils";
import {CylindricalDetectionZone} from "@/YellowSubmarine/detection system/CylindricalDetectionZone";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {Angle, Vector3} from "@babylonjs/core";
import {ConversationBuilder} from "@/YellowSubmarine/dialogue system/ConversationBuilder";

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
        pedro.conversation = new ConversationBuilder()
            .say("Ceci est un texte en [g]gras[/g]")
            .then("Ceci est un texte en [i]italique[/i]")
            .then("Ceci est un texte en [s=16][c=blue]petit et bleu[/s][/g]")
            .then("Voici un mot en [g]gras[/g], un en [i]italique[/i], et [c=#ffffff]couleur rouge.[/g] Il y a beaucoup de texte AAAA")
            .build();

        pedro.cameraConfiguration = new CameraConfiguration();
        pedro.cameraConfiguration.target = pedro.transformNode;
        pedro.cameraConfiguration.distanceFromTarget = 10;
        pedro.cameraConfiguration.offset = Vector3.Up().scale(2);
        pedro.cameraConfiguration.wantedAlpha = Angle.FromDegrees(-90).radians();


        return pedro;
    }
}