import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";
import {Observable} from "@babylonjs/core";

export class MultipleChoicesDialogueNode extends AbstractDialogueNode{

    private _choices: AbstractDialogueNode[] = [];
    private _currentChoiceIndex = 0;

    private _onChosenChildChangedObservable: Observable<AbstractDialogueNode> = new Observable<AbstractDialogueNode>();
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

    public addChoice(choice: AbstractDialogueNode): void {
        this._choices.push(choice);
    }

    public updateChoice(newChoice: AbstractDialogueNode, index: number): void {
        this._choices[index] = newChoice;
    }

    public choose(choice: AbstractDialogueNode) {
        const currentChoice = this.next;
        if(this._choices.includes(choice)) {
            this._currentChoiceIndex = this._choices.indexOf(choice);
        }
        else {
            this._currentChoiceIndex = 0;
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

    get children(): AbstractDialogueNode[] {
        return this._choices.slice();
    }

    get mainText(): string {
        return this._text;
    }

    get next(): AbstractDialogueNode | undefined {
        return this._choices[this._currentChoiceIndex];
    }



}