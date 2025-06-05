import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {ActionDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/ActionDialogueNode";
import {ConditionalDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/ConditionalDialogueNode";
import {MultipleChoicesDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/MultipleChoicesDialogueNode";

export class DialogueBuilder {

    private _dialogue: Dialogue = new Dialogue();
    public get dialogue(): Dialogue{
        return this._dialogue;
    }
    public set dialogue(value: Dialogue) {
        this._dialogue = value;
    }

    private _currentNode?: SimpleDialogueNode;
    public get currentNode(): SimpleDialogueNode | undefined {
        return this._currentNode;
    }

    public chainSimpleNode(
        text: string
    ): DialogueBuilder{
        const newNode = new SimpleDialogueNode(this._dialogue, text);
        if(!this._dialogue.rootNode) {
            this._dialogue.rootNode = newNode;
            this._currentNode = newNode;
        }
        else if(this._currentNode){
            this._currentNode.nextNode = newNode;
            this._currentNode = newNode;
        }
        return this;
    }

    public chainActionNode(
        text: string,
        action:() => void,
        executeOnEnter?: boolean
    ): DialogueBuilder{
        const newNode = new ActionDialogueNode(this._dialogue, text, action, executeOnEnter);
        if(!this._dialogue.rootNode){
            this._dialogue.rootNode = newNode;
            this._currentNode = newNode;
        }
        else if(this._currentNode){
            this._currentNode.nextNode = newNode;
            this._currentNode = newNode;
        }
        return this;
    }

    public chainConditionalNode(
        text: string,
        condition:() => boolean,
        trueNode?: AbstractDialogueNode,
        falseNode?: AbstractDialogueNode
    ):
        {
        trueBuilder: DialogueBuilder,
        falseBuilder: DialogueBuilder
        }
    {
        const conditionalNode = new ConditionalDialogueNode(this._dialogue, text, condition);
        conditionalNode.trueNode = trueNode;
        conditionalNode.falseNode = falseNode;
        if(!this._dialogue.rootNode){
            this._dialogue.rootNode = conditionalNode;
        }
        else if(this._currentNode){
            this._currentNode.nextNode = conditionalNode;
        }
        return {
            trueBuilder: this.createSubDialogueBuilderInitialized(trueNode),
            falseBuilder: this.createSubDialogueBuilderInitialized(falseNode)
        };
    }

    public chainMultipleChoicesDialogueNode(text: string, ...choices: AbstractDialogueNode[]): DialogueBuilder[]{
        const multipleChoicesDialogueNode = new MultipleChoicesDialogueNode(this._dialogue, text, choices);
        if(!this._dialogue.rootNode){
            this._dialogue.rootNode = multipleChoicesDialogueNode;
        }
        else if(this._currentNode){
            this._currentNode.nextNode = multipleChoicesDialogueNode;
        }
        return choices.map<DialogueBuilder>( (choice) => this.createSubDialogueBuilderInitialized(choice) );
    }

    private createSubDialogueBuilderInitialized(rootNode?: AbstractDialogueNode): DialogueBuilder{
        const dialogueBuilder = new DialogueBuilder();
        if(rootNode){
            dialogueBuilder.dialogue = this._dialogue;
            if(rootNode instanceof SimpleDialogueNode){
                dialogueBuilder._currentNode = rootNode;
            }
        }
        return dialogueBuilder;
    }



}