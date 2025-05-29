import {NPC} from "@/YellowSubmarine/npcs/NPC";
import {Utils} from "@/YellowSubmarine/Utils";
import {CylindricalDetectionZone} from "@/YellowSubmarine/detection system/CylindricalDetectionZone";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {Angle, Color3, PBRMaterial, Vector3} from "@babylonjs/core";
import {CartoonShaderMaterial} from "@/YellowSubmarine/shader material/CartoonShaderMaterial";
import {SoundManager} from "@/YellowSubmarine/sound system/SoundManager";
import {ConversationBuilder} from "@/YellowSubmarine/dialogue system/ConversationBuilder";
import {TempleBall} from "@/YellowSubmarine/temple/TempleBall";

export class NPCFactory {

    public static async createPedro(): Promise<NPC>{
        const pedro = new NPC();
        pedro.name = "Pedro";
        Utils.loadMesh("models/characters/pedro.glb").then((result) => {
            pedro.mesh = result.meshes[0];
            result.meshes.forEach((mesh) => {
                const mat = mesh.material as PBRMaterial;
                if(mat){
                    const toonMat = new CartoonShaderMaterial();
                    toonMat.assignMaterial(mesh).then(() => {
                        toonMat.configureFromPBRMaterial(mat);
                    });
                }
            })
            SoundManager.instance.playMUSIC("pedro", {
                spatialSound: true,
                loop: true,
                autoplay: true,
                maxDistance: 80,
                rolloffFactor: 1.5,
            }, pedro.mesh);
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
            .then("Voici un mot en [g]gras[/g], un en [i]italique[/i], et [c=#ffffff]couleur rouge.[/c] Il y a beaucoup de texte AAAA")
            .build();

        pedro.cameraConfiguration = new CameraConfiguration();
        pedro.cameraConfiguration.target = pedro.transformNode;
        pedro.cameraConfiguration.distanceFromTarget = 10;
        pedro.cameraConfiguration.offset = Vector3.Up().scale(2);
        pedro.cameraConfiguration.wantedAlpha = Angle.FromDegrees(-90).radians();

        return pedro;
    }

    public static async createFox(): Promise<NPC>{
        const fox = new NPC();
        fox.name = "Le perdu";
        Utils.loadMesh("models/characters/fox.glb").then((result) => {
            fox.mesh = result.meshes[0];
            result.meshes.forEach((mesh) => {
                const mat = mesh.material as PBRMaterial;
                if(mat){
                    const toonMat = new CartoonShaderMaterial();
                    toonMat.assignMaterial(mesh).then(() => {
                        toonMat.configureFromPBRMaterial(mat);
                    });
                }
            })
        });
        fox.detectionZone = new CylindricalDetectionZone( {
            height: 8,
            diameterTop: 45,
            diameterBottom: 45,
        }, true);

        // fox.detectionZone.zone.position.set(0, -11, 0);

        // for test purpose
        fox.conversation = new ConversationBuilder()
            .say("[g][c=rouge] AAAAAAAAAAAAAAAAAAAAAAAAAA [/g][/c]")
            .build();

        fox.cameraConfiguration = new CameraConfiguration();
        fox.cameraConfiguration.target = fox.transformNode;
        fox.cameraConfiguration.distanceFromTarget = 10;
        // fox.cameraConfiguration.offset = Vector3.Up().scale(2);
        fox.cameraConfiguration.wantedAlpha = Angle.FromDegrees(-90).radians();

        return fox;
    }

    public static async createGirl(): Promise<NPC>{
        const scientific = new NPC();
        scientific.name = "La scientifique";
        Utils.loadMesh("models/characters/phare_girl.glb").then((result) => {
            scientific.mesh = result.meshes[0];
            result.meshes.forEach((mesh) => {
                const mat = mesh.material as PBRMaterial;
                if(mat){
                    const toonMat = new CartoonShaderMaterial();
                    toonMat.assignMaterial(mesh).then(() => {
                        toonMat.configureFromPBRMaterial(mat);
                    });
                }
            })
        });
        scientific.detectionZone = new CylindricalDetectionZone( {
            height: 8,
            diameterTop: 45,
            diameterBottom: 45,
        }, true);

        // scientific.detectionZone.zone.position.set(0, -11, 0);

        // for test purpose
        scientific.conversation = new ConversationBuilder()
            .say("[g]hon hon la science [/g]")
            .build();

        return scientific;
    }

    public static async createScribe(): Promise<NPC>{
        const scribe = new NPC();
        scribe.name = "L'écrivain";
        Utils.loadMesh("models/characters/scribe.glb").then((result) => {
            scribe.mesh = result.meshes[0];
            result.meshes.forEach((mesh) => {
                const mat = mesh.material as PBRMaterial;
                if(mat){
                    const toonMat = new CartoonShaderMaterial();
                    toonMat.assignMaterial(mesh).then(() => {
                        toonMat.configureFromPBRMaterial(mat);
                    });
                }
            })
        });
        scribe.detectionZone = new CylindricalDetectionZone( {
            height: 8,
            diameterTop: 45,
            diameterBottom: 45,
        }, true);

        // scribe.detectionZone.zone.position.set(0, -11, 0);

        // for test purpose
        scribe.conversation = new ConversationBuilder()
            .say("[g] SILEEEEEEEENCE, L'INSPIRATION ARRIVE [/g]")
            .build();

        return scribe;
    }

    public static async createRabbit(): Promise<NPC>{
        const rabbit = new NPC();
        rabbit.name = "Chef des Rapoutins";

        Utils.loadMesh("models/characters/lapin.glb").then((result) => {
            rabbit.mesh = result.meshes[0];

            result.meshes.forEach((mesh) => {

                const mat = mesh.material as PBRMaterial;
                if(mat){
                    const toonMat = new CartoonShaderMaterial();
                    toonMat.assignMaterial(mesh).then(() => {
                        toonMat.configureFromPBRMaterial(mat);
                    });
                }
            })
        });

        rabbit.detectionZone = new CylindricalDetectionZone( {
            height: 8,
            diameterTop: 45,
            diameterBottom: 45,
        }, true);

        rabbit.detectionZone.zone.position.set(0, -2, 0);

        // for test purpose
        rabbit.conversation = new ConversationBuilder()
            .say(". . . On s'est déjà vu non ? ")
            .build();


        return rabbit;
    }
}