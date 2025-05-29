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
        InteractionManager.instance.makeInteractionAvailable(this);
    }

    public makeUnavailable(){
        InteractionManager.instance.makeInteractionUnavailable(this);
    }

    public abstract executeInteraction(): void;

}