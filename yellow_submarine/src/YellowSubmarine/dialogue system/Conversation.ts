import {Observable} from "@babylonjs/core";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {NextDialogueInteraction} from "@/YellowSubmarine/dialogue system/interactions/NextDialogueInteraction";
import {NPC} from "@/YellowSubmarine/NPC";


export class Conversation {

    private _npc?: NPC;

    public onDialogueStart: Observable<AbstractDialogueNode> = new Observable();
    public onConversationStart: Observable<Conversation> = new Observable();
    public onConversationEnd: Observable<Conversation> = new Observable();

    private _nextInteraction: NextDialogueInteraction = new NextDialogueInteraction(this);
    private _currentNode: AbstractDialogueNode | undefined = undefined;
    private _rootNode: AbstractDialogueNode | undefined = undefined;

    public get npc(): NPC | undefined{
        return this._npc;
    }

    public set npc(npc: NPC | undefined) {
        this._npc = npc;
    }

    public get root(){
        return this._rootNode;
    }
    public set root(value: AbstractDialogueNode | undefined){
        this._rootNode = value;
    }

    private enterNode(node: AbstractDialogueNode){
        this._currentNode = node;
        this._currentNode.execute();
        this.onDialogueStart.notifyObservers(node);
    }

    public startConversation(): void {
        this._currentNode = this.root;
        this.enterNode(<AbstractDialogueNode>this._currentNode);
        this.onConversationStart.notifyObservers(this);
        this._nextInteraction.makeAvailable();
    }

    public next(): void {
        const nextNode = this._currentNode?.nextNode;
        if (nextNode) {
            this.enterNode(nextNode);
        } else {
            this._currentNode = undefined;
            this._nextInteraction.makeUnavailable();
            this.onConversationEnd.notifyObservers(this);
        }
    }

    public get currentDialogue(): AbstractDialogueNode | undefined{
        return this._currentNode;
    }


}