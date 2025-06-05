import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {WorldInteraction} from "@/YellowSubmarine/world interaction system/interaction/WorldInteraction";
import {AbstractMesh} from "@babylonjs/core";

export class StartConversationInteraction extends WorldInteraction{

    public get description(): string {
        return `Parler`;
    }

    constructor(private _conversation: Conversation) {
        super();
    }

    get mesh(): AbstractMesh | undefined {
        return this._conversation.conversationProvider?.mesh;
    }

    protected _onAvailable(): void {
        return
    }

    protected _onUnavailable(): void {
        return;
    }

    protected _start(): void {
        this._conversation.startConversation();
        this.endOnNextFrame();
    }

    protected _end(): void {
        return;
    }

}