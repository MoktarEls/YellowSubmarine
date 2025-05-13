import {AdvancedDynamicTexture, Rectangle, TextBlock} from "@babylonjs/gui";
import {AbstractMesh} from "@babylonjs/core";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";
import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {
    StartConversationInteraction
} from "@/YellowSubmarine/dialogue system/interactions/StartConversationInteraction";
import {NextDialogueInteraction} from "@/YellowSubmarine/dialogue system/interactions/NextDialogueInteraction";
import {Game} from "@/YellowSubmarine/Game";

export class UIManager {

    private _ui = AdvancedDynamicTexture.CreateFullscreenUI("_ui", undefined, Game.scene);

    private _dialogueUi: Rectangle;
    private _dialogueUiLabel: TextBlock;


    constructor() {
        InteractionManager.instance.onInteractionAvailable.add( (interaction) => this.showInteractionUi(interaction) )
        InteractionManager.instance.onInteractionUnavailable.add( () => this.hideInteractionUi() )

        this._ui.idealWidth = 600;

        this._dialogueUi = new Rectangle();
        this._dialogueUi.width = 0.2;
        this._dialogueUi.height = "40px";
        this._dialogueUi.cornerRadius = 20;
        this._dialogueUi.color = "black";
        this._dialogueUi.background = "white";
        this._dialogueUi.thickness = 4;

        this._dialogueUiLabel = new TextBlock();
        this._dialogueUi.addControl(this._dialogueUiLabel);
        this._ui.addControl(this._dialogueUi);
        this._dialogueUi.isVisible = false;
        this._dialogueUiLabel.isVisible = true;
        this._dialogueUiLabel.text = "NO TEXT";


    }

    private showInteractionUi(interaction : AbstractInteraction) {
        if(interaction instanceof StartConversationInteraction){
            this._dialogueUi.isVisible = true;
            this._dialogueUiLabel.text = `Press "${interaction.code}" to talk to ${interaction.conversation.npc?.name}`;
            this._dialogueUi.linkWithMesh(interaction.conversation.npc?.mesh ?? null);
        }
        else if(interaction instanceof NextDialogueInteraction){
            this._dialogueUi.isVisible = true;
            this._dialogueUiLabel.text = `${interaction.conversation.npc?.name} : ${interaction.conversation.currentDialogue?.text} [${interaction.code}]`;
            this._dialogueUi.linkWithMesh(interaction.conversation.npc?.mesh ?? null);
        }

    }


    private hideInteractionUi() {
        this._dialogueUi.isVisible = false;
    }
}