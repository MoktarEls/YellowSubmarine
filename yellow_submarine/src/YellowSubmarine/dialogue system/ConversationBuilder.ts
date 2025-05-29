import {Conversation} from "@/YellowSubmarine/dialogue system/Conversation";
import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";

export class ConversationBuilder {
    private root?: SimpleDialogueNode;
    private current?: SimpleDialogueNode;
    private _onEnding?: () => void;

    public say(text: string): ConversationBuilder {
        const node = new SimpleDialogueNode();
        node.text = text;

        if (!this.root) {
            this.root = node;
        } else if (this.current) {
            this.current.nextNode = node;
        }

        this.current = node;
        return this;
    }

    public then(text: string): ConversationBuilder {
        return this.say(text);
    }

    public build(): Conversation {
        const conversation = new Conversation();
        if(this._onEnding) conversation.onEnding = this._onEnding;
        if (this.root) {
            conversation.root = this.root;
        }
        return conversation;
    }

    public setOnEnding(value: () => void): ConversationBuilder {
        this._onEnding = value;
        return this;
    }
}
