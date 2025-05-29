import {NPC} from "@/YellowSubmarine/npcs/NPC";
import {Utils} from "@/YellowSubmarine/Utils";
import {CylindricalDetectionZone} from "@/YellowSubmarine/detection system/CylindricalDetectionZone";
import {CameraConfiguration} from "@/YellowSubmarine/camera system/CameraConfiguration";
import {Angle, PBRMaterial, Vector3} from "@babylonjs/core";
import {CartoonShaderMaterial} from "@/YellowSubmarine/shader material/CartoonShaderMaterial";
import {SoundManager} from "@/YellowSubmarine/sound system/SoundManager";
import {ConversationBuilder} from "@/YellowSubmarine/dialogue system/ConversationBuilder";
import {JournalUI} from "@/YellowSubmarine/quest system/ui/JournalUI";
import {QuestManager} from "@/YellowSubmarine/quest system/QuestManager";

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

        pedro.conversation = new ConversationBuilder()
            .say("OH CA VA PAS DE ME REVEILLER COMME CA ! MAIS QUI ES TU !!!!!")
            .then("Ca fais bien longtemps que j'ai pas vu quelqu'un comme toi ici ! Je me présente, je suis Pedro. Je pêche ici depuis bel lurette mon n'veu.")
            .then("Ici, eh beh ici je sais pas trop comment te le décrire. C'est assez vide et ça mord pas trop au bout de ma canne... ")
            .then("Mais ! Y'a un p'tit endroit au nord d'ici un peu particulier.")
            .then("Y'avait deux boules et plein de poteaux, j'ai pas tout compris et j'étais fatigué Ducoup j'suis parti..")
            .then("Normalement tu devrais l'apercevoir d'ici ! Fais attention ! ")
            .then("Hésite pas à aller voir les habitants des autres, ils devraient pouvoir t'aider !")
            .then("Bon aller moi je retourne pêcher (et dormir au passage... ça fais bieeeen ..... loongt....................... zzZZZzzzzzZZzzzzzzzz)")
            .setOnEnding(() => {
                JournalUI.instance.addEntryToQuest(QuestManager.instance.getQuest("dreamland"), "Pedro s'est endormie");
                QuestManager.instance.getQuest("dreamland")?.updateCurrentStepStatus();
            })
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
        fox.name = "Crimson";
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

        fox.conversation = new ConversationBuilder()
            .say("Je sais pas si tu vois la même chose que moi (peut-être que c'est un mirage). Y'a une piste de bowling là-bas où y'a les quilles qui sortent de l'eau.")
            .then("Y'a une sorte de boule de bowling qui était sur l'île. J'ai essayé de jouer avec des quilles en glace mais ça a pas trop marché.")
            .then("Parmi les quilles j'ai mis une bouteille que j'ai trouvée dans le coin et bizarrement, quand j'ai fait un STRIKE ! Y'a une note qui est sortie.")
            .then("Y'avait marqué ça : « Redina, la plus forte, restait en retrait afin de couvrir leurs arrières »")
            .then("Bizarre l'ambiance... J'en ai marre de jouer au bowling donc j'te donne la boule ! Mais prends-en soin !")
            .then("Allez, je vais jouer à la pétanque moi...")
            .build();

        fox.cameraConfiguration = new CameraConfiguration();
        fox.cameraConfiguration.target = fox.transformNode;
        fox.cameraConfiguration.distanceFromTarget = 10;
        fox.cameraConfiguration.wantedAlpha = Angle.FromDegrees(-90).radians();

        return fox;
    }

    public static async createGirl(): Promise<NPC>{
        const scientific = new NPC();
        scientific.name = "Rosa";
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


        scientific.conversation = new ConversationBuilder()
            .say("Si je suis la trajectoire de cette étoile, alors je peux peut-être réussir à démontrer que e = m6 !")
            .then("Oh salut toi ! T'as un sacré sous-marin ! J'adore les sous-marins tu tombes à pic !")
            .then("Pour la peine, je vais te présenter les conclusions de mon expérience AHAH prépare toi à en prendre plein la vue !")
            .then("J'ai trouvé une boule de couleurs avec deux parchemins. Commençons par les FAITS !")
            .then("Fait numéro 1 : la boule est d'une couleur spécifique... Hmmmm...... Ok soit.")
            .then("Fait numéro 2 : les textes parlent de je ne sais pas trop quoi à vrai dire. Mais ! J'ai l'impression que les couleurs sont importantes !")
            .then("Maintenant, passons à la THEORIE !")
            .then("Théorie numéro 1 : une boule de couleur a une position unique. Mais où ??? AHHH Je ne comprends pas....")
            .then("Théorie numéro 2 : il existe d'autres boules de couleur car mes deux indices parlent de couleurs différentes de celle de ma boule !")
            .then("Et voilà c'est un peu tout ce que j'ai, je suis dans une sacrée impasse. Je vais sûrement rater le prix Nobel cette année.....")
            .then("Allez j'te laisse la boule, je suis passé à autre chose ! Tu me diras une prochaine fois si ça t'a été utile !")
            .then("À la revoyure !")
            .build();



        scientific.cameraConfiguration = new CameraConfiguration();
        scientific.cameraConfiguration.target = scientific.transformNode;
        scientific.cameraConfiguration.distanceFromTarget = 40;
        scientific.cameraConfiguration.wantedAlpha = Angle.FromDegrees(-120).radians();
        scientific.cameraConfiguration.wantedBeta = Angle.FromDegrees(50).radians();

        return scientific;
    }

    public static async createScribe(): Promise<NPC>{
        const scribe = new NPC();
        scribe.name = "Marcel";
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

        scribe.conversation = new ConversationBuilder()
            .say("Que penses-tu de mon prochain poème jeune étranger ?")
            .then("[g]Ballade d’un Génie Naufragé[/g]")
            .then("[i]Je suis ce grand Marcel, qu’aucun vent ne dérange, Poète illustre et fier, perdu sur cet étrange Territoire obscur, bordé par l’inconnu, Où des piliers sans fin soutiennent l’absolu.[/i]")
            .then("[i]Je ne sais point comment j’ai pu atterrir ici, Mais l’endroit me salue d’un silence exquis. Tantôt le ciel s’emplit de choses voltigeantes, Tantôt le vide plane, en formes déchirantes.[/i]")
            .then("[i]Sur le rivage nu, comme un don du destin, J’aperçus une orbe, d’un éclat si divin Que mon esprit, troublé par tant de magnificence, Faillit se noyer dans sa propre éloquence.[/i]")
            .then("[i]Juste à côté dormait, message dans bouteille, Un parchemin d’échos, d’une main non pareille. Il était écrit, sans honte ni limite : [/i] [c=blue]« Pendant que le soleil était au zénith, Un nuage grisâtre s’approchait depuis l’ouest ». Ah ! Que cette phrase est d’un raffinement leste ![/c]")
            .then("[i]Moi seul, Marcel, pouvais en saisir l’essence, Car mon verbe est plus fort que toute connaissance.[/i]")
            .then("[i]Je retourne à présent vers la fontaine noire, Dont l’encre tachera les vers de ma mémoire.[/i]")
            .then("Voila ! J'espère que ce ne fut pas un peu trop long. Maintenant file je dois me concentrer !")
            .build();


        scribe.cameraConfiguration = new CameraConfiguration();
        scribe.cameraConfiguration.target = scribe.transformNode;
        scribe.cameraConfiguration.distanceFromTarget = 10;
        scribe.cameraConfiguration.wantedAlpha = Angle.FromDegrees(150).radians();

        return scribe;
    }

    public static async createRabbit(): Promise<NPC>{
        const rabbit = new NPC();
        rabbit.name = "Matthew";

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

        rabbit.conversation = new ConversationBuilder()
            .say("[i][c=blue]Trois sœurs, Redina, Greina, Bluella, voyant le nuage s'approcher, se dirigeaient à l'opposée....[/i][/c]")
            .then("Hmmmm... Qu'est-ce que ça peut vouloir dire....")
            .then("AAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
            .then("TU M'AS FAIS PEUR !!!!")
            .then("TIENS PREND ÇA ! ET PARS LOIN D'ICI SANS REVENIR !!!!!!!!!!!!!!!!")
            .build();



        rabbit.cameraConfiguration = new CameraConfiguration();
        rabbit.cameraConfiguration.target = rabbit.transformNode;
        rabbit.cameraConfiguration.distanceFromTarget = 10;
        rabbit.cameraConfiguration.wantedAlpha = Angle.FromDegrees(-90).radians();

        return rabbit;
    }
}