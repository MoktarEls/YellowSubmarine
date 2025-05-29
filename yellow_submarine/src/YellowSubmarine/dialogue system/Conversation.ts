import {Observable} from "@babylonjs/core";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {NextDialogueInteraction} from "@/YellowSubmarine/dialogue system/interactions/NextDialogueInteraction";
import {ConfigurableCamera} from "@/YellowSubmarine/camera system/ConfigurableCamera";
import {Player} from "@/YellowSubmarine/Player";
import {NPC} from "@/YellowSubmarine/npcs/NPC";
import {IConversationProvider} from "@/YellowSubmarine/dialogue system/IConversationProvider";


export class Conversation {

    private _onEnding = (): void => {return};

    private _conversationProvider?: IConversationProvider;

    public static onAnyDialogueStart:Observable<AbstractDialogueNode> = new Observable();
    public static onAnyConversationStart: Observable<Conversation> = new Observable();
    public static onAnyConversationEnd: Observable<Conversation> = new Observable();
    public static onAdvanceDialogueRequested: Observable<void> = new Observable();

    public onDialogueStart: Observable<AbstractDialogueNode> = new Observable();
    public onConversationStart: Observable<Conversation> = new Observable();
    public onConversationEnd: Observable<Conversation> = new Observable();

    private _nextInteraction: NextDialogueInteraction = new NextDialogueInteraction(this);
    private _currentNode: AbstractDialogueNode | undefined = undefined;
    private _rootNode: AbstractDialogueNode | undefined = undefined;

    public get conversationProvider(): IConversationProvider | undefined{
        return this._conversationProvider;
    }

    public set conversationProvider(conversationProvider: IConversationProvider | undefined) {
        this._conversationProvider = conversationProvider;
    }

    public get root(){
        return this._rootNode;
    }
    public set root(value: AbstractDialogueNode | undefined){
        this._rootNode = value;
    }

    public get onEnding(): () => void {
        return this._onEnding;
    }

    public set onEnding(value: () => void) {
        this._onEnding = value;
    }

    private enterNode(node: AbstractDialogueNode){
        this._currentNode = node;
        this._currentNode.execute();
        this.onDialogueStart.notifyObservers(node);
        Conversation.onAnyDialogueStart.notifyObservers(node);
    }

    public startConversation(): void {
        this._currentNode = this.root;
        this.onConversationStart.notifyObservers(this);
        Conversation.onAnyConversationStart.notifyObservers(this);
        this.enterNode(<AbstractDialogueNode>this._currentNode);
        this._nextInteraction.makeAvailable();
        const cameraConfiguration = this._conversationProvider?.cameraConfiguration
        if(cameraConfiguration) {
            ConfigurableCamera.instance.cameraConfiguration = cameraConfiguration;
        }
    }

    public next(): void {
        const nextNode = this._currentNode?.nextNode;
        if (nextNode) {
            this.enterNode(nextNode);
        } else {
            this.endConversation();
        }
    }

    private endConversation() {
        this._currentNode = undefined;
        this._nextInteraction.makeUnavailable();
        this.onConversationEnd.notifyObservers(this);
        Conversation.onAnyConversationEnd.notifyObservers(this);
        ConfigurableCamera.instance.cameraConfiguration = Player.playerCameraConfiguration;
        this._onEnding();
    }

    public isInProgress(): boolean {
        return !!this._currentNode;
    }
}