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

export type DialogueBuildingResult<CurrentBuilderType extends AbstractDialogueNode,ResultType extends AbstractDialogueNode> = { currentBuilder: DialogueNodeBuilder<CurrentBuilderType>, resultBuilder: DialogueNodeBuilder<ResultType> };

export abstract class DialogueNodeBuilder<T extends AbstractDialogueNode> {

    protected readonly _node: T;
    private _root: AbstractDialogueNode;

    public get node(): T {
        return this._node;
    }

    public get root(): AbstractDialogueNode {
        return this._root;
    }

    public constructor(node: T) {
        this._node = node;
        this._root = node;
    }

    public chainSimpleNode(
        text: string,
        index?: number,
    ): DialogueBuildingResult<T, SimpleDialogueNode>{
        const newSimpleNode = new SimpleDialogueNode(text);
        this.chain(newSimpleNode, index);
        return {
            currentBuilder: this,
            resultBuilder: DialogueNodeBuilder.createSubBuilder(
                this,
                newSimpleNode,
                SingleChildNodeDialogueBuilder
            )
        };
    }

    public chainActionNode(
        text: string,
        action: () => void,
        index?: number,
    ): DialogueBuildingResult<T, ActionDialogueNode>{
        const newActionNode = new ActionDialogueNode(text, action);
        this.chain(newActionNode, index);
        return {
            currentBuilder: this,
            resultBuilder: DialogueNodeBuilder.createSubBuilder(
                this,
                newActionNode,
                SingleChildNodeDialogueBuilder,
            )
        };
    }

    public chainConditionalNode(
        condition: () => boolean,
        trueNode: AbstractDialogueNode,
        falseNode: AbstractDialogueNode,
        index?: number,
    ): DialogueBuildingResult<T, ConditionalDialogueNode>{
        const newConditionalNode = new ConditionalDialogueNode(condition, trueNode, falseNode);
        this.chain(newConditionalNode, index);
        return {
            currentBuilder: this,
            resultBuilder: DialogueNodeBuilder.createSubBuilder(
                this,
                newConditionalNode,
                ConditionalNodeDialogueBuilder
            )
        };
    }

    public chainMultipleChoicesNode(
        text: string,
        index?: number,
    ) : DialogueBuildingResult<T, MultipleChoicesDialogueNode>{
        const newMultipleChoicesNode = new MultipleChoicesDialogueNode(text);
        this.chain(newMultipleChoicesNode, index);
        return {
            currentBuilder: this,
            resultBuilder: DialogueNodeBuilder.createSubBuilder(
                this,
                newMultipleChoicesNode,
                MultipleChoicesNodeDialogueBuilder
            )
        };
    }

    public build(dialogueProvider: IDialogueProvider): Dialogue{
        return new Dialogue(this._root, dialogueProvider);
    }

    public static createSimpleNodeRootedDialogue(text: string){
        return this.createDialogueBuilder<SimpleDialogueNode, SimpleNodeDialogueBuilder>(SimpleNodeDialogueBuilder, text);
    }

    public static createActionNodeRootedDialogue(text: string, action: () => void){
        return this.createDialogueBuilder<ActionDialogueNode, ActionNodeDialogueBuilder>(ActionNodeDialogueBuilder, text);
    }

    public static createConditionalNodeRootedDialogue(condition: () => boolean, trueNode?: AbstractDialogueNode, falseNode?: AbstractDialogueNode){
        return this.createDialogueBuilder<ConditionalDialogueNode, ConditionalNodeDialogueBuilder>(ConditionalNodeDialogueBuilder, condition, trueNode, falseNode);
    }

    public static createMultipleChoicesNodeRootedDialogue(){
        return this.createDialogueBuilder<MultipleChoicesDialogueNode, MultipleChoicesNodeDialogueBuilder>(MultipleChoicesNodeDialogueBuilder, )
    }

    private static createDialogueBuilder<RootNodeType extends AbstractDialogueNode, BuilderType extends DialogueNodeBuilder<RootNodeType>>(
        rootNodeConstructorClass: ( new (...args: any[]) => BuilderType ),
        ...builderArgs: any[]
    ): BuilderType {
        return new rootNodeConstructorClass(builderArgs);
    }

    protected abstract chain(nodeToChain: AbstractDialogueNode, index?: number): void;

    protected static createSubBuilder<
        ParentNodeType extends AbstractDialogueNode,
        ChildNodeType extends AbstractDialogueNode,
    >(
        parentBuilder: DialogueNodeBuilder<ParentNodeType>,
        createdNode: ChildNodeType,
        subBuilderConstructorClass: new (node: ChildNodeType) => DialogueNodeBuilder<ChildNodeType>,
    ){
        const subBuilder = new subBuilderConstructorClass(createdNode);
        subBuilder._root = parentBuilder._root;
        return subBuilder;
    }


}