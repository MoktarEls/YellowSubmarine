import {Observable} from "@babylonjs/core";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {SwitchDialogueNodeInteraction} from "@/YellowSubmarine/dialogue system/interactions/SwitchDialogueNodeInteraction";
import {ConfigurableCamera} from "@/YellowSubmarine/camera system/ConfigurableCamera";
import {Player} from "@/YellowSubmarine/Player";
import {IConversationProvider} from "@/YellowSubmarine/dialogue system/IConversationProvider";
import {Game} from "@/YellowSubmarine/Game";
import {DialogueNodeInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueNodeInteraction";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";


export class Conversation {

    public static onBeforeAnyConversationStartObservable: Observable<Conversation> = new Observable();
    public static onAfterAnyConversationStartObservable: Observable<Conversation> = new Observable();
    public static onBeforeAnyConversationEndObservable: Observable<Conversation> = new Observable();
    public static onAfterAnyConversationEndObservable: Observable<Conversation> = new Observable();

    public onBeforeConversationStartObservable: Observable<Conversation> = new Observable();
    public onAfterConversationStartObservable: Observable<Conversation> = new Observable();
    public onBeforeConversationEndObservable: Observable<Conversation> = new Observable();
    public onAfterConversationEndObservable: Observable<Conversation> = new Observable();

    private _conversationProvider: IConversationProvider;
    private _rootNode: AbstractDialogueNode;
    private _currentNode: AbstractDialogueNode | undefined = undefined;

    constructor() {
        this.onBeforeConversationStartObservable.add(() => Conversation.onBeforeAnyConversationStartObservable.notifyObservers(this) );
        this.onAfterConversationStartObservable.add(() => Conversation.onAfterAnyConversationStartObservable.notifyObservers(this) );
        this.onBeforeConversationEndObservable.add(() => Conversation.onBeforeAnyConversationEndObservable.notifyObservers(this) );
        this.onAfterConversationEndObservable.add(() => Conversation.onAfterAnyConversationEndObservable.notifyObservers(this) );
    }

    public get conversationProvider(): IConversationProvider{
        return this._conversationProvider;
    }

    public get root(){
        return this._rootNode;
    }

    public set root(value: AbstractDialogueNode){
        this._rootNode = value;
    }

    public startConversation(): void {
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
        this.onBeforeConversationStartObservable.notifyObservers(this);
        this.switchNode(this._rootNode);
        this.onAfterConversationStartObservable.notifyObservers(this);
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

    public endConversation() {
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