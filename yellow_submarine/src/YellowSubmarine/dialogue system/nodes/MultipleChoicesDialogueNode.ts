import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {Observable} from "@babylonjs/core";
import {
    MultipleChoicesDialogueNodeBuilder
} from "@/YellowSubmarine/dialogue system/builder/MultipleChoicesDialogueNodeBuilder";

export class MultipleChoicesDialogueNode extends AbstractDialogueNode<MultipleChoicesDialogueNode, number | "add", MultipleChoicesDialogueNodeBuilder>{

    private _choices: AbstractDialogueNode<never, never, never>[] = [];
    private _currentSelectionIndex = 0;

    private _onChosenChildChangedObservable: Observable<AbstractDialogueNode<never, never, never>> = new Observable<AbstractDialogueNode<never, never, never>>();
    private _onNoChildIsChosenObservable: Observable<void> = new Observable();

    public get onChosenChildChangedObservable(){
        return this._onChosenChildChangedObservable;
    }

    public get onNoChildIsChosenObservable(){
        return this._onNoChildIsChosenObservable;
    }

    constructor(text: string) {
        super(text);
    }

    public addChoice(choice: AbstractDialogueNode<never, never, never>): void {
        this._choices.push(choice);
    }

    public updateChoice(newChoice: AbstractDialogueNode<never, never, never>, index: number): void {
        this._choices[index] = newChoice;
    }

    public selectNext(){
        this._currentSelectionIndex = (((this._currentSelectionIndex + 1) % this._choices.length) + this._choices.length) % this._choices.length;
    }

    public selectPrevious(){
        this._currentSelectionIndex = (((this._currentSelectionIndex - 1) % this._choices.length) + this._choices.length) % this._choices.length;
    }

    public get selectedNode(){
        return this.next;
    }

    public choose(choice: AbstractDialogueNode<never, never, never>) {
        const currentChoice = this.next;
        if(this._choices.includes(choice)) {
            this._currentSelectionIndex = this._choices.indexOf(choice);
        }
        else {
            this._currentSelectionIndex = 0;
        }
        const newChoice = this.next;
        if(currentChoice !== newChoice) {
            if(newChoice){
                this._onChosenChildChangedObservable.notifyObservers(newChoice);
            }
            else{
                this._onNoChildIsChosenObservable.notifyObservers();
            }
        }
    }

    get children(): AbstractDialogueNode<never, never, never>[] {
        return this._choices.slice();
    }

    get mainText(): string {
        return this._text;
    }

    get next(): AbstractDialogueNode<never, never, never> | undefined {
        return this._choices[this._currentSelectionIndex];
    }

    getBuilderCtor(){
        return MultipleChoicesDialogueNodeBuilder;
    }


}