export abstract class AbstractDialogueNode {

    public abstract get text() : string;

    public abstract execute(): void;

    public abstract isFinal(): boolean;

}