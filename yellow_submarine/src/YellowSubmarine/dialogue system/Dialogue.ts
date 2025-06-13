import {Observable} from "@babylonjs/core";
import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {ConfigurableCamera} from "@/YellowSubmarine/camera system/ConfigurableCamera";
import {IDialogueProvider} from "@/YellowSubmarine/dialogue system/IDialogueProvider";
import {Game} from "@/YellowSubmarine/Game";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";
import {StartDialogueInteraction} from "@/YellowSubmarine/dialogue system/interactions/StartDialogueInteraction";
import {DialogueInteraction} from "@/YellowSubmarine/dialogue system/interactions/DialogueInteraction";
import {DialogueInteractionManager} from "@/YellowSubmarine/dialogue system/interactions/DialogueInteractionManager";

export class Dialogue {

    private static _onAnyDialogueStartedObservable: Observable<Dialogue> = new Observable();
    private static _onAnyDialogueEndedObservable: Observable<Dialogue> = new Observable();
    private static _onAnyDialogueNodeStartedObservable: Observable<{dialogue: Dialogue, node: AbstractDialogueNode<any>}> = new Observable();

    private _onDialogueStartedObservable: Observable<void> = new Observable();
    private _onDialogueEndedObservable: Observable<void> = new Observable();
    private _onDialogueNodeStartedObservable: Observable<AbstractDialogueNode<any>> = new Observable();

    private _dialogueInteractionManager : InteractionManager<DialogueInteraction> = new DialogueInteractionManager(this);

    static get onAnyDialogueStartedObservable(): Observable<Dialogue> {
        return this._onAnyDialogueStartedObservable;
    }

    static get onAnyDialogueEndedObservable(): Observable<Dialogue> {
        return this._onAnyDialogueEndedObservable;
    }

    static get onAnyDialogueNodeStartedObservable(): Observable<{ dialogue: Dialogue; node: AbstractDialogueNode<any> }> {
        return this._onAnyDialogueNodeStartedObservable;
    }

    get onDialogueStartedObservable(): Observable<void> {
        return this._onDialogueStartedObservable;
    }

    get onDialogueEndedObservable(): Observable<void> {
        return this._onDialogueEndedObservable;
    }

    get onDialogueNodeStartedObservable(): Observable<AbstractDialogueNode<any>> {
        return this._onDialogueNodeStartedObservable;
    }

    private _currentNode: AbstractDialogueNode<any> | undefined;

    public get currentNode(): AbstractDialogueNode<any> | undefined {
        return this._currentNode;
    }

    public get rootNode(): AbstractDialogueNode<any> {
        return this._rootNode;
    }

    public get dialogueProvider(): IDialogueProvider | undefined {
        return this._dialogueProvider;
    }

    public set dialogueProvider(value: IDialogueProvider | undefined) {
        this._dialogueProvider = value;
    }

    private _dialogueProvider: IDialogueProvider | undefined;

    constructor(private _rootNode: AbstractDialogueNode<any>, dialogueProvider?: IDialogueProvider) {
        this._dialogueProvider = dialogueProvider;
        this._onDialogueStartedObservable.add(() => Dialogue._onAnyDialogueStartedObservable.notifyObservers(this) );
        this._onDialogueEndedObservable.add(() => Dialogue._onAnyDialogueEndedObservable.notifyObservers(this) );
        this._onDialogueNodeStartedObservable.add((node) => Dialogue._onAnyDialogueNodeStartedObservable.notifyObservers({dialogue:this, node: node}) );
    }

    public startDialogue(): void {
        // TODO : Add the camera changing logic to the npc
        const cameraConfiguration = this._dialogueProvider?.cameraConfiguration
        if(cameraConfiguration) {
            ConfigurableCamera.instance.cameraConfiguration = cameraConfiguration;
        }
        this.goToNextNode();
        this._onDialogueStartedObservable.notifyObservers();
    }

    public goToNextNode(): void {
        const nextNode = this._currentNode ? this._currentNode?.next : this._rootNode;
        if(this._currentNode){
            this._currentNode.End(this);
        }
        this._currentNode = nextNode;
        if(this._currentNode) {
            this._currentNode.Start(this);
            this._onDialogueNodeStartedObservable.notifyObservers(this._currentNode);
            if(this._currentNode.isAutoSkipped){
                this.goToNextNode();
            }
        }
        else{
            this.endDialogue();
        }
    }

    private endDialogue() {
        ConfigurableCamera.instance.cameraConfiguration = Game.player.playerCameraConfiguration;
        this._onDialogueEndedObservable.notifyObservers();
    }

    public isInProgress(): boolean {
        return this._currentNode !== undefined;
    }
}