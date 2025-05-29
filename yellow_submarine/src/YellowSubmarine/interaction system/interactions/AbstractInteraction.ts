import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";

export abstract class AbstractInteraction {

    protected _code:string;
    protected  _simplifiedCode: string;

    public get code(): string {
        return this._code;
    }

    public get simplifiedCode(): string {
        return this._simplifiedCode;
    }

    protected constructor(code: string, simplifiedCode: string) {
        this._code = code;
        this._simplifiedCode = simplifiedCode;
    }

    public makeAvailable(){
        InteractionManager.instance.makeInteractionAvailable(this);
    }

    public makeUnavailable(){
        InteractionManager.instance.makeInteractionUnavailable(this);
    }

    public abstract executeInteraction(): void;

}