import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {SimpleDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/SimpleDialogueNode";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {IDialogueProvider} from "@/YellowSubmarine/dialogue system/IDialogueProvider";
import {SimpleDialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/SimpleDialogueNodeBuilder";
import {ActionDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/ActionDialogueNode";
import {ActionDialogueNodeBuilder} from "@/YellowSubmarine/dialogue system/builder/ActionDialogueNodeBuilder";

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
        NewIndexType,
        NewNodeCtor extends (new (...args: any[]) => NewNodeType),
        NewBuilderCtor extends (new (node: NewNodeType) => NewBuilderType),
        NewBuilderType extends DialogueNodeChainingBuilder<NewBuilderType, NewIndexType, NewNodeType> = InstanceType<NewBuilderCtor> ,
        NewNodeType extends AbstractDialogueNode<NewNodeType, NewIndexType, NewBuilderType> = InstanceType<NewNodeCtor>,
    >(
        nodeCtor: NewNodeCtor,
        index: IndexType,
        ...nodeArgs: ConstructorParameters<NewNodeCtor>
    ): NewBuilderType {
        const newNode = new nodeCtor(...nodeArgs);
        this.chain(newNode, index);
        const builderCtor = newNode.getBuilderCtor();
        return this.createSubBuilder<
            NewIndexType,
            NewNodeType,
            NewBuilderType,
            NewBuilderCtor
        >
        (
            builderCtor as NewBuilderCtor,
            newNode
        );
    }


    // --------------------------------------- C R E A T I O N ---------------------------------------------------------

    private static createNewDialogueBuilder<
        NewIndexType,
        NewNodeCtor extends (new (...args: any[]) => NewNodeType),
        NewBuilderCtor extends (new (node: NewNodeType) => NewBuilderType),
        NewBuilderType extends DialogueNodeChainingBuilder<NewBuilderType, NewIndexType, NewNodeType> = InstanceType<NewBuilderCtor> ,
        NewNodeType extends AbstractDialogueNode<NewNodeType, NewIndexType, NewBuilderType> = InstanceType<NewNodeCtor>,
    >(
        nodeCtor: NewNodeCtor,
        ...nodeCtorArgs: ConstructorParameters<NewNodeCtor>
    ): NewBuilderType{
        const rootNode = new nodeCtor(...nodeCtorArgs);
        const builderCtor = rootNode.getBuilderCtor();
        return new builderCtor(rootNode)
    }

    public static createNewSimpleDialogueNodeBuilder(
        ...nodeArgs: ConstructorParameters<typeof SimpleDialogueNode>
    ){
        return this.createNewDialogueBuilder(
            SimpleDialogueNode,
            ...nodeArgs
        )
    }

    public static createNewActionDialogueNodeBuilder(
        ...nodeArgs: ConstructorParameters<typeof ActionDialogueNode>
    ){
        return this.createNewDialogueBuilder<
            void,
            ActionDialogueNode,
            ActionDialogueNodeBuilder,
            typeof ActionDialogueNode,
            typeof ActionDialogueNodeBuilder
        >(
            ActionDialogueNode,
            ActionDialogueNodeBuilder,
            ...nodeArgs
        )
    }


    // -----------------------------------------------------------------------------------------------------------------

    private createSubBuilder<
        NewIndexType,
        NewNodeType extends AbstractDialogueNode,
        NewBuilderType extends DialogueNodeChainingBuilder<NewIndexType, NewNodeType>,
        NewBuilderCtor extends new (node: NewNodeType) => NewBuilderType
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

    protected abstract chain(nodeToChain: AbstractDialogueNode, index: IndexType): void;

}