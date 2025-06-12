import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {Dialogue} from "@/YellowSubmarine/dialogue system/Dialogue";
import {IDialogueProvider} from "@/YellowSubmarine/dialogue system/IDialogueProvider";

type IndexTypeOfNode<
    Node extends AbstractDialogueNode<any>
> = Node extends AbstractDialogueNode<infer IndexType> ? IndexType : never;

type IfVoid<T, Then, Else> = [T] extends [void] ? Then : Else;

export class DialogueNodeChainingBuilder<
    NodeType extends AbstractDialogueNode<any>,
>{
    protected readonly _node: NodeType;
    private _root: AbstractDialogueNode<any>;

    private _dialogueProvider: IDialogueProvider | undefined

    public setDialogueProvider(value: IDialogueProvider | undefined): DialogueNodeChainingBuilder<NodeType>  {
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
        NewNodeType extends AbstractDialogueNode<NewIndexType> = InstanceType<NewNodeCtor>,
        NewIndexType = IndexTypeOfNode<NewNodeType>,
    >(
        nodeCtor: NewNodeCtor,
        ...args: IfVoid<
            IndexTypeOfNode<NodeType>,
            ConstructorParameters<NewNodeCtor>,
            [index:IndexTypeOfNode<NodeType>, ...nodeArgs:ConstructorParameters<NewNodeCtor>]
        >
    ): DialogueNodeChainingBuilder<NewNodeType> {
        let index;
        let nodeArgs;
        if(args.length > nodeCtor.length) {
            index = args[0];
            nodeArgs = args.slice(1);
        }
        else{
            index = undefined;
            nodeArgs = args;
        }
        const newNode = new nodeCtor(...nodeArgs);
        this._node.setChild(newNode, index);
        const subBuilder = new DialogueNodeChainingBuilder(newNode);
        subBuilder._root = this._root;
        subBuilder._dialogueProvider = this._dialogueProvider;
        return subBuilder;
    }


    // --------------------------------------- C R E A T I O N ---------------------------------------------------------

    public static createNewDialogueBuilder<
        NewNodeCtor extends new (...args: any[]) => NewNodeType,
        NewNodeType extends AbstractDialogueNode<any> = InstanceType<NewNodeCtor>,
    >(
        nodeCtor:NewNodeCtor,
        ...nodeCtorArgs: ConstructorParameters<NewNodeCtor>
    ): DialogueNodeChainingBuilder<NewNodeType> {
        const rootNode = new nodeCtor(...nodeCtorArgs);
        return new DialogueNodeChainingBuilder(rootNode);
    }


    // -------------------------------------------- B U I L D ----------------------------------------------------------

    public build(): Dialogue {
        return new Dialogue(this._root, this._dialogueProvider);
    }


}