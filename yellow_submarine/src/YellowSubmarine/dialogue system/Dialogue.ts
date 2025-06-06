import {Observable} from "@babylonjs/core";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {SwitchDialogueNodeInteraction} from "@/YellowSubmarine/dialogue system/interactions/SwitchDialogueNodeInteraction";
import {ConfigurableCamera} from "@/YellowSubmarine/camera system/ConfigurableCamera";
import {Player} from "@/YellowSubmarine/Player";
import {IDialogueProvider} from "@/YellowSubmarine/dialogue system/IDialogueProvider";
import {Game} from "@/YellowSubmarine/Game";
import {DialogueNodeInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueNodeInteraction";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";
import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";


export class Dialogue {

    public static onAnyDialogueStartedObservable: Observable<Dialogue> = new Observable();
    public static onAnyDialogueEndedObservable: Observable<Dialogue> = new Observable();

    public onDialogueStartedObservable: Observable<Dialogue> = new Observable();
    public onDialogueEndedObservable: Observable<Dialogue> = new Observable();

    private _currentNode: AbstractDialogueNode | undefined;

    public get rootNode(): AbstractDialogueNode {
        return this._rootNode;
    }

    public get dialogueProvider(): IDialogueProvider{
        return this._dialogueProvider;
    }

    constructor(private _rootNode: AbstractDialogueNode, private _dialogueProvider: IDialogueProvider) {
        this.onDialogueStartedObservable.add(() => Dialogue.onAnyDialogueStartedObservable.notifyObservers(this) );
        this.onDialogueEndedObservable.add(() => Dialogue.onAnyDialogueEndedObservable.notifyObservers(this) );
    }

    public startDialogue(): void {
        /*
        this._currentNode = this.root;
        this.onConversationStart.notifyObservers(this);
        Conversation.onAnyConversationStart.notifyObservers(this);
        this.enterNode(<AbstractDialogueNode>this._currentNode);
        // this._nextInteraction.makeAvailable();
        const cameraConfiguration = this._conversationProvider?.cameraConfiguration
        if(cameraConfiguration) {
            ConfigurableCamera.instance.cameraConfiguration = cameraConfiguration;
        }
        */
        // TODO : Add the camera changing logic to the npc
        const cameraConfiguration = this._dialogueProvider?.cameraConfiguration
        if(cameraConfiguration) {
            ConfigurableCamera.instance.cameraConfiguration = cameraConfiguration;
        }
        this.advanceDialogue();
        this.onDialogueStartedObservable.notifyObservers(this);
    }

    public advanceDialogue(): void {
        this._currentNode = this._currentNode ? this._currentNode?.next : this._rootNode;
        if(!this._currentNode) {
        }
    }

    private endDialogue() {
        /*
        this._currentNode = undefined;
        this.onConversationEnd.notifyObservers(this);
        Conversation.onAnyConversationEnd.notifyObservers(this);
        ConfigurableCamera.instance.cameraConfiguration = Game.player.playerCameraConfiguration;
        if(!this._hasBeenRead) this._onEnding();
        this._hasBeenRead = true;
        */
        ConfigurableCamera.instance.cameraConfiguration = Game.player.playerCameraConfiguration;
        this.onDialogueEndedObservable.notifyObservers(this);
    }

    public isInProgress(): boolean {
        return !!this._currentNode;
    }
}