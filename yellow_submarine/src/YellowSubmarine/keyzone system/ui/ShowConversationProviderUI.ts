import {UI} from "@/YellowSubmarine/ui system/UI";
import {Container, Control, Rectangle, TextBlock} from "@babylonjs/gui";
import {KeyZone} from "@/YellowSubmarine/keyzone system/KeyZone";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {UIManager} from "@/YellowSubmarine/ui system/UIManager";
import {StartDialogueInteraction} from "@/YellowSubmarine/dialogue system/interactions/StartDialogueInteraction";
import {DialogueInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueInteraction";
import {World} from "@/YellowSubmarine/World";

export class ShowConversationProviderUI extends UI{

    private _container: Container;
    private _childControls: Control[] = [];

    public constructor(){
        super();
        this._container = new Container();
        this._container.isVisible = true;
        KeyZone.onAnyKeyZoneEntered.add(this.createUIs.bind(this));
        KeyZone.onAnyKeyZoneExited.add(this.destroyUIs.bind(this));
        Dialogue.onAnyDialogueStartedObservable.add(this.hideUIs.bind(this));
        Dialogue.onAnyDialogueEndedObservable.add(this.showUIs.bind(this));
        World.instance.worldInteractionManager.onInteractionAvailable.add( (interaction) => {
            if(interaction instanceof StartDialogueInteraction || interaction instanceof DialogueInteraction ){
                this.hideUIs();
            }
        });
        World.instance.worldInteractionManager.onInteractionUnavailable.add( (interaction) => {
            if(interaction instanceof StartDialogueInteraction || interaction instanceof DialogueInteraction ){
                this.showUIs();
            }
        });
    }

    public get controlNode(): Control {
        return this._container;
    }

    private createUIs(keyzone: KeyZone) {
        const conversationProviders = keyzone.conversationProviders;
        for (let i = 0; i < conversationProviders.length; i++) {
            const conversationProvider = conversationProviders[i];

            const rec1 = new Rectangle();
            rec1.width = "180px";
            rec1.height = "60px";
            rec1.cornerRadius = 60;
            rec1.color = "rgb(168, 98, 68)";
            rec1.thickness = 4;
            rec1.background = "rgb(255, 199, 130)";

            const label1 = new TextBlock();
            label1.fontSize = 30;
            label1.text = `● ● ●`;
            rec1.addControl(label1);

            UIManager.instance.ui.addControl(rec1);
            this._childControls.push(rec1);

            const mesh = conversationProvider.mesh;
            if(mesh){
                rec1.linkWithMesh(mesh);
                rec1.linkOffsetY = "-50px";
            }

        }

    }

    private destroyUIs(){
        this._childControls.forEach((child) => child.dispose());
        this._childControls = [];
    }

    private showUIs(){
        this._childControls.forEach((child) => child.isVisible = true );
    }

    private hideUIs(){
        this._childControls.forEach((child) => child.isVisible = false );
    }

}