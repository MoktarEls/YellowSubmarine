import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";

export abstract class AbstractInteraction {

    protected _code:string;

    public get code(): string {
        return this._code;
    }

    protected constructor(code: string) {
        this._code = code;
    }

    public makeAvailable(){
        InteractionManager.instance.addAvailableInteraction(this);
    }

    public makeUnavailable(){
        InteractionManager.instance.removeAvailableInteraction();
    }

    public abstract executeInteraction(): void;

}