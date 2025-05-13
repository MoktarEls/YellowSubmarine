import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";

export abstract class AbstractInteraction {

    public get code(): string {
        return this._code;
    }

    constructor(private _code: string) {}

    public makeAvailable(){
        InteractionManager.instance.addAvailableInteraction(this);
    }

    public makeUnavailable(){
        InteractionManager.instance.removeAvailableInteraction();
    }

    public abstract executeInteraction(): void;

}