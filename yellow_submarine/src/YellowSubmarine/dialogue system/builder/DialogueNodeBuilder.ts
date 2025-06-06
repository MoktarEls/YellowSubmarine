import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";
import {ActionDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/ActionDialogueNode";
import {ConditionalDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/ConditionalDialogueNode";
import {MultipleChoicesDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/MultipleChoicesDialogueNode";
import {MultipleChoicesNodeDialogueBuilder} from "@/YellowSubmarine/dialogue system/builder/MultipleChoicesNodeDialogueBuilder";
import {ConditionalNodeDialogueBuilder} from "@/YellowSubmarine/dialogue system/builder/ConditionalNodeDialogueBuilder";
import {SingleChildNodeDialogueBuilder} from "@/YellowSubmarine/dialogue system/builder/SingleChildNodeDialogueBuilder";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {IDialogueProvider} from "@/YellowSubmarine/dialogue system/IDialogueProvider";
import {SimpleNodeDialogueBuilder} from "@/YellowSubmarine/dialogue system/builder/SimpleNodeDialogueBuilder";
import {ActionNodeDialogueBuilder} from "@/YellowSubmarine/dialogue system/builder/ActionNodeDialogueBuilder";

/*export type DialogueBuildingResult<
    CurrentNodeType extends AbstractDialogueNode,
    CurrentIndexType,
    NewNodeType extends AbstractDialogueNode,
    NewIndexType
> = {
    currentBuilder: DialogueNodeBuilder<CurrentNodeType, CurrentIndexType>,
    resultBuilder: DialogueNodeBuilder<NewNodeType, NewIndexType>
};*/

export abstract class DialogueNodeBuilder<NodeType extends AbstractDialogueNode, IndexType> {

    protected readonly _node: NodeType;
    protected readonly _dialogueProvider: IDialogueProvider;
    private _dialogue: Dialogue;

    public get node(): NodeType {
        return this._node;
    }

    public get dialogue(): Dialogue {
        return this._dialogue;
    }

    public constructor(node: NodeType, dialogueProvider: IDialogueProvider) {
        this._node = node;
        this._dialogueProvider = dialogueProvider;
        this._dialogue = new Dialogue(node, dialogueProvider);
    }

    public chainNode
    <
        NewNodeType extends AbstractDialogueNode,
        NewIndexType
    >(
        nodeCtor: new (...args: any[]) => NewNodeType,
        nodeBuilderCtor: new (node: NewNodeType, dialogueProvider:IDialogueProvider) => DialogueNodeBuilder<NewNodeType, NewIndexType>,
        index: IndexType,
        ...nodeCtorArgs: unknown[]
    ): DialogueNodeBuilder<NewNodeType, NewIndexType>{
        const newNode = new nodeCtor(nodeCtorArgs);
        this.chain(newNode, index);
        /*return {
            currentBuilder: this,
            resultBuilder: this.createSubBuilder(
                newNode,
                nodeBuilderCtor,
            )
        }*/
        return this.createSubBuilder(
            newNode,
            nodeBuilderCtor,
        )
    }

    public chainSimpleNode(
        text: string,
        index: IndexType,
    ){
        const newSimpleNode = new SimpleDialogueNode(text);
        this.chain(newSimpleNode, index);
        /*return {
            currentBuilder: this,
            resultBuilder: this.createSubBuilder(
                newSimpleNode,
                SimpleNodeDialogueBuilder
            )
        }*/
        return this.createSubSimpleNodeBuilder(newSimpleNode);
    }

    public chainActionNode(
        text: string,
        action: () => void,
        index: IndexType,
    ){
        const newActionNode = new ActionDialogueNode(text, action);
        this.chain(newActionNode, index);
        /*return {
            currentBuilder: this,
            resultBuilder: this.createSubBuilder(
                newActionNode,
                SingleChildNodeDialogueBuilder,
            )
        };*/
        return this.createSubActionNodeBuilder(newActionNode);
    }

    public chainConditionalNode(
        condition: () => boolean,
        index: IndexType,
    ){
        const newConditionalNode = new ConditionalDialogueNode(condition);
        this.chain(newConditionalNode, index);
        /*return {
            currentBuilder: this,
            resultBuilder: this.createSubBuilder(
                newConditionalNode,
                ConditionalNodeDialogueBuilder
            )
        };*/
        return this.createSubConditionalNodeBuilder(newConditionalNode);
    }

    public chainMultipleChoicesNode(
        text: string,
        index: IndexType,
    ){
        const newMultipleChoicesNode = new MultipleChoicesDialogueNode(text);
        this.chain(newMultipleChoicesNode, index);
        /*return {
            currentBuilder: this,
            resultBuilder: this.createSubBuilder(
                newMultipleChoicesNode,
                MultipleChoicesNodeDialogueBuilder
            )
        };*/
        return this.createSubMultipleChoiceNodeBuilder(newMultipleChoicesNode);
    }

    public static createNewDialogueBuilder<
        NodeType extends AbstractDialogueNode,
        IndexType extends AbstractDialogueNode,
    >(
        nodeCtor: new (...args: any[]) => NodeType,
        nodeBuilderCtor: new (node: NodeType, dialogueProvider:IDialogueProvider) => DialogueNodeBuilder<NodeType, IndexType>,
        dialogueProvider: IDialogueProvider,
        ...nodeCtorArgs: unknown[]
    ): DialogueNodeBuilder<NodeType, IndexType>{
        const newNode = new nodeCtor(nodeCtorArgs);
        return new nodeBuilderCtor(newNode, dialogueProvider);
    }

    public static createSimpleNodeRootedDialogue(dialogueProvider: IDialogueProvider, text: string){
        return new SimpleNodeDialogueBuilder(new SimpleDialogueNode(text), dialogueProvider);
    }

    public static createActionNodeRootedDialogue(dialogueProvider: IDialogueProvider, text: string, action: () => void){
        return new ActionNodeDialogueBuilder(new ActionDialogueNode(text, action), dialogueProvider);
    }

    public static createConditionalNodeRootedDialogue(dialogueProvider: IDialogueProvider, condition: () => boolean, trueNode?: AbstractDialogueNode, falseNode?: AbstractDialogueNode){
        return new ConditionalNodeDialogueBuilder(new ConditionalDialogueNode(condition, trueNode, falseNode), dialogueProvider);
    }

    public static createMultipleChoicesNodeRootedDialogue(dialogueProvider: IDialogueProvider, text: string){
        return new MultipleChoicesNodeDialogueBuilder(new MultipleChoicesDialogueNode(text), dialogueProvider);
    }

    protected abstract chain(nodeToChain: AbstractDialogueNode, index: IndexType): void;

    protected createSubBuilder<
        NodeType extends AbstractDialogueNode,
        IndexType
    >(
        node: NodeType,
        builderCtor: new (node: NodeType, provider: IDialogueProvider) => DialogueNodeBuilder<NodeType, IndexType>
    ): DialogueNodeBuilder<NodeType, IndexType> {
        const subBuilder = new builderCtor(node, this._dialogueProvider);
        subBuilder._dialogue = this._dialogue;
        return subBuilder;
    }

    protected createSubSimpleNodeBuilder(node: SimpleDialogueNode){
        const subBuilder = new SimpleNodeDialogueBuilder(node, this._dialogueProvider);
        subBuilder._dialogue = this._dialogue;
        return subBuilder;
    }
    protected createSubActionNodeBuilder(node: ActionDialogueNode){
        const subBuilder = new ActionNodeDialogueBuilder(node, this._dialogueProvider);
        subBuilder._dialogue = this._dialogue;
        return subBuilder;
    }
    protected createSubConditionalNodeBuilder(node: ConditionalDialogueNode){
        const subBuilder = new ConditionalNodeDialogueBuilder(node, this._dialogueProvider);
        subBuilder._dialogue = this._dialogue;
        return subBuilder;
    }
    protected createSubMultipleChoiceNodeBuilder(node: MultipleChoicesDialogueNode){
        const subBuilder = new MultipleChoicesNodeDialogueBuilder(node, this._dialogueProvider);
        subBuilder._dialogue = this._dialogue;
        return subBuilder;
    }

}