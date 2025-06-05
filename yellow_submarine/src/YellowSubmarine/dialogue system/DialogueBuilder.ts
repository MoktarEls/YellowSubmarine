import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";

export class DialogueBuilder {
    private root?: SimpleDialogueNode;
    private current?: SimpleDialogueNode;
    private _onEnding?: () => void;

    public say(text: string): DialogueBuilder {
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

    public then(text: string): DialogueBuilder {
        return this.say(text);
    }

    public build(): Dialogue {
        const conversation = new Dialogue();
        if(this._onEnding) conversation.onEnding = this._onEnding;
        if (this.root) {
            conversation.root = this.root;
        }
        return conversation;
    }

    public setOnEnding(value: () => void): DialogueBuilder {
        this._onEnding = value;
        return this;
    }
}
