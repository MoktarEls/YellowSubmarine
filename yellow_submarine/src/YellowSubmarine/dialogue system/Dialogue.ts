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

    set rootNode(node: AbstractDialogueNode) {
        this._rootNode = node;
    }

    get rootNode(): AbstractDialogueNode {
        return this._rootNode;
    }

    public static onBeforeAnyDialogueStartObservable: Observable<Dialogue> = new Observable();
    public static onAfterAnyDialogueStartObservable: Observable<Dialogue> = new Observable();
    public static onBeforeAnyDialogueEndObservable: Observable<Dialogue> = new Observable();
    public static onAfterAnyDialogueEndObservable: Observable<Dialogue> = new Observable();

    public onBeforeDialogueStartObservable: Observable<Dialogue> = new Observable();
    public onAfterDialogueStartObservable: Observable<Dialogue> = new Observable();
    public onBeforeDialogueEndObservable: Observable<Dialogue> = new Observable();
    public onAfterDialogueEndObservable: Observable<Dialogue> = new Observable();

    private _rootNode!: AbstractDialogueNode;
    private _currentNode: AbstractDialogueNode | undefined;

    constructor() {
        this.onBeforeDialogueStartObservable.add(() => Dialogue.onBeforeAnyDialogueStartObservable.notifyObservers(this) );
        this.onAfterDialogueStartObservable.add(() => Dialogue.onAfterAnyDialogueStartObservable.notifyObservers(this) );
        this.onBeforeDialogueEndObservable.add(() => Dialogue.onBeforeAnyDialogueEndObservable.notifyObservers(this) );
        this.onAfterDialogueEndObservable.add(() => Dialogue.onAfterAnyDialogueEndObservable.notifyObservers(this) );
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
        this.onBeforeDialogueStartObservable.notifyObservers(this);
        this.switchNode(this._rootNode);
        this.onAfterDialogueStartObservable.notifyObservers(this);
    }

    public switchNode(newNode: AbstractDialogueNode){
        if(this._currentNode){
            this._currentNode.exit();
        }
        this._currentNode = newNode;
        if(this._currentNode){
            this._currentNode.enter();
        }
    }

    public endDialogue() {
        /*
        this._currentNode = undefined;
        this.onConversationEnd.notifyObservers(this);
        Conversation.onAnyConversationEnd.notifyObservers(this);
        ConfigurableCamera.instance.cameraConfiguration = Game.player.playerCameraConfiguration;
        if(!this._hasBeenRead) this._onEnding();
        this._hasBeenRead = true;
        */

    }

    public isInProgress(): boolean {
        return !!this._currentNode;
    }
}