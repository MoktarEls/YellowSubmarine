import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {IDialogueProvider} from "@/YellowSubmarine/dialogue system/IDialogueProvider";

type IndexTypeOfNode<Node extends AbstractDialogueNode<any, any, any>> =
    Node extends AbstractDialogueNode<any, infer IndexType, any> ? IndexType : never;

type BuilderTypeOfNode<Node extends AbstractDialogueNode<any, any, any>> =
    Node extends AbstractDialogueNode<any, any, infer BuilderType> ? BuilderType : never;

type IndexTypeOfBuilder<Builder extends DialogueNodeChainingBuilder<any, any, any>> =
    Builder extends DialogueNodeChainingBuilder<any, infer IndexType, any> ? IndexType : never;

type NodeTypeOfBuilder<Builder extends DialogueNodeChainingBuilder<any, any, any>> =
    Builder extends DialogueNodeChainingBuilder<any, any, infer NodeType> ? NodeType : never;

export abstract class DialogueNodeChainingBuilder<
    SelfType extends DialogueNodeChainingBuilder<
        SelfType,
        IndexType,
        NodeType
    >,
    IndexType,
    NodeType extends AbstractDialogueNode<
        NodeType,
        IndexType,
        SelfType
    >
>{
    protected readonly _node: NodeType;
    private _root: AbstractDialogueNode<any, any, any>;

    private _dialogueProvider: IDialogueProvider | undefined

    public setDialogueProvider(value: IDialogueProvider | undefined): DialogueNodeChainingBuilder<SelfType, IndexType, NodeType>  {
        this._dialogueProvider = value;
        return this;
    }

    public constructor(node: NodeType) {
        this._node = node;
        this._root = node;
    }

    // --------------------------------------- C H A I N I N G ---------------------------------------------------------

    public chainNode<
        NewNodeCtor extends new (...args: any[]) => NewNodeType,
        NewNodeType extends AbstractDialogueNode<NewNodeType, NewIndexType, NewBuilderType> = InstanceType<NewNodeCtor>,
        NewIndexType = IndexTypeOfNode<NewNodeType>,
        NewBuilderType extends DialogueNodeChainingBuilder<NewBuilderType, NewIndexType, NewNodeType> = BuilderTypeOfNode<NewNodeType>,
    >(
        nodeCtor: NewNodeCtor,
        index: IndexType,
        ...nodeArgs: ConstructorParameters<typeof nodeCtor>
    ): NewBuilderType {
        const newNode = new nodeCtor(...nodeArgs);
        this.chain(newNode, index);
        const builderCtor = newNode.getBuilderCtor();
        return this.createSubBuilder(
            builderCtor,
            newNode
        );
    }


    // --------------------------------------- C R E A T I O N ---------------------------------------------------------

    public static createNewDialogueBuilder<
        NewNodeCtor extends new (...args: any[]) => NewNodeType,
        NewNodeType extends AbstractDialogueNode<NewNodeType, NewIndexType, NewBuilderType> = InstanceType<NewNodeCtor>,
        NewIndexType = IndexTypeOfNode<NewNodeType>,
        NewBuilderType extends DialogueNodeChainingBuilder<NewBuilderType, NewIndexType, NewNodeType> = BuilderTypeOfNode<NewNodeType>
    >(
        nodeCtor:NewNodeCtor,
        ...nodeCtorArgs: ConstructorParameters<NewNodeCtor>
    ): NewBuilderType {
        const rootNode = new nodeCtor(...nodeCtorArgs);
        const builderCtor = rootNode.getBuilderCtor();
        return new builderCtor(rootNode);
    }


    // -----------------------------------------------------------------------------------------------------------------

    private createSubBuilder<
        NewBuilderCtor extends new (node: NewNodeType) => NewBuilderType,
        NewBuilderType extends DialogueNodeChainingBuilder<NewBuilderType, NewIndexType, NewNodeType> = InstanceType<NewBuilderCtor>,
        NewIndexType = IndexTypeOfBuilder<NewBuilderType>,
        NewNodeType extends AbstractDialogueNode<NewNodeType, NewIndexType, NewBuilderType> = NodeTypeOfBuilder<NewBuilderType>
    >(
        builderCtor: NewBuilderCtor,
        node: NewNodeType,
    ): NewBuilderType {
        const builder = new builderCtor(node);
        builder._root = this._root;
        builder._dialogueProvider = this._dialogueProvider;
        return builder;
    }

    // -------------------------------------------- B U I L D ----------------------------------------------------------

    public build(): Dialogue {
        return new Dialogue(this._root, this._dialogueProvider);
    }

    protected abstract chain(nodeToChain: AbstractDialogueNode<any, any, any>, index: IndexType): void;

}