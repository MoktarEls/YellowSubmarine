import {AdvancedDynamicTexture} from "@babylonjs/gui";
import {Game} from "@/YellowSubmarine/Game";
import {DialogueInteractionUI} from "@/YellowSubmarine/interaction system/ui/DialogueInteractionUI";
import {WorldInteractionUI} from "@/YellowSubmarine/interaction system/ui/WorldInteractionUI";


export class UIManager {

    private _ui = AdvancedDynamicTexture.CreateFullscreenUI("_ui", undefined, Game.scene);

    private _worldInteractionUI: WorldInteractionUI = new WorldInteractionUI();
    private _dialogueInteractionUI: DialogueInteractionUI = new DialogueInteractionUI();

    constructor() {
        this._ui.addControl(this._worldInteractionUI.controlNode);
        this._ui.addControl(this._dialogueInteractionUI.controlNode);
    }

/*
    private handleInteraction(interaction: AbstractInteraction, isAvailable: boolean): void {

        this._worldInteractionUI.hide();
        this._dialogueInteractionUI.hide();

        let interactionUI:UI<any> | undefined = undefined;

        if(interaction instanceof WorldInteraction){
            interactionUI = this._worldInteractionUI;
        }
        else if(interaction instanceof DialogueInteraction){
            interactionUI = this._dialogueInteractionUI;
        }

        if(interactionUI){
            if(isAvailable){
                interactionUI.show(interaction);
            } else {
                interactionUI.hide();
            }
        } else {
            throw new Error(`Interaction of type ${typeof interaction} is not handled by the UI Manager`);
        }

    }
*/


/*    private showInteractionUi(interaction : AbstractInteraction) {
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
    }*/
}