import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {IDialogueProvider} from "@/YellowSubmarine/dialogue system/IDialogueProvider";

export type DialogueBuildingResult<
    CurrentNodeType extends AbstractDialogueNode,
    CurrentIndexType,
    NewNodeType extends AbstractDialogueNode,
    NewIndexType
> = {
    currentBuilder: DialogueNodeBuilder<CurrentNodeType, CurrentIndexType>,
    resultBuilder: DialogueNodeBuilder<NewNodeType, NewIndexType>
};

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
    ): DialogueBuildingResult<NodeType, IndexType, NewNodeType, NewIndexType>{
        const newNode = new nodeCtor(nodeCtorArgs);
        this.chain(newNode, index);
        return {
            currentBuilder: this,
            resultBuilder: this.createSubBuilder(
                newNode,
                nodeBuilderCtor,
            )
        }
    }

    public static createNewDialogueBuilder<
        NodeType extends AbstractDialogueNode,
        IndexType,
    >(
        nodeCtor: new (...args: any[]) => NodeType,
        nodeBuilderCtor: new (node: NodeType, dialogueProvider:IDialogueProvider) => DialogueNodeBuilder<NodeType, IndexType>,
        dialogueProvider: IDialogueProvider,
        ...nodeCtorArgs: unknown[]
    ): DialogueNodeBuilder<NodeType, IndexType>{
       const rootNode = new nodeCtor(nodeCtorArgs);
       return new nodeBuilderCtor(rootNode, dialogueProvider);
    }

    /*public static createSimpleNodeRootedDialogue(dialogueProvider: IDialogueProvider, text: string){
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
*/

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

    /*protected createSubSimpleNodeBuilder(node: SimpleDialogueNode){
        const subBuilder = new SimpleNodeDialogueBuilder(node, this._dialogueProvider);
        subBuilder._root = this._root;
        return subBuilder;
    }
    protected createSubActionNodeBuilder(node: ActionDialogueNode){
        const subBuilder = new ActionNodeDialogueBuilder(node, this._dialogueProvider);
        subBuilder._root = this._root;
        return subBuilder;
    }
    protected createSubConditionalNodeBuilder(node: ConditionalDialogueNode){
        const subBuilder = new ConditionalNodeDialogueBuilder(node, this._dialogueProvider);
        subBuilder._root = this._root;
        return subBuilder;
    }
    protected createSubMultipleChoiceNodeBuilder(node: MultipleChoicesDialogueNode){
        const subBuilder = new MultipleChoicesNodeDialogueBuilder(node, this._dialogueProvider);
        subBuilder._root = this._root;
        return subBuilder;
    }*/



}