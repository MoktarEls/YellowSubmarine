import {QuestStep} from "@/YellowSubmarine/quest system/QuestStep";
import {SoundManager} from "@/YellowSubmarine/sound system/SoundManager";
import {QuestUI} from "@/YellowSubmarine/quest system/ui/QuestUI";

export type QuestState = 'inactive' | 'active' | 'completed';

export class Quest{

    private _id: string;
    private _name: string;
    private _state: QuestState;
    private _currentStepIndex: number;
    private _steps: QuestStep[];

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get state(): QuestState {
        return this._state;
    }

    public set state(value: QuestState) {
        this._state = value;
    }

    public get currentStepIndex(): number {
        return this._currentStepIndex;
    }

    public set currentStepIndex(value: number) {
        this._currentStepIndex = value;
    }

    public get steps(): QuestStep[] {
        return this._steps;
    }

    public set steps(value: QuestStep[]) {
        this._steps = value;
    }

    constructor(id: string, name: string, state: QuestState, currentStepIndex: number) {
        this._id = id;
        this._name = name;
        this._state = state;
        this._currentStepIndex = currentStepIndex;
        this._steps = []
    }

    public startQuest() {
        this._state = "active";
        this.playQuestSound();
        QuestUI.instance.refresh();
    }

    public stopQuest() {
        this._state = "completed";
        QuestUI.instance.refresh();
    }

    public nextStep() {
        if(!(this._currentStepIndex === this._steps.length - 1)){
            this._currentStepIndex++;
            this.playQuestSound();
        }
        QuestUI.instance.refresh();

    }

    public updateCurrentStepStatus() {
        this._steps[this._currentStepIndex].validate();
    }

    private playQuestSound(){
        SoundManager.instance.playSFX("quest", {
            loop: false,
            autoplay: true
        });
    }
}
