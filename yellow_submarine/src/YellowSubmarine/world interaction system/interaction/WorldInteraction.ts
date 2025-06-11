import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {AbstractMesh} from "@babylonjs/core";

export abstract class WorldInteraction extends AbstractInteraction{

    private static _code = "KeyE";
    private static _simplifiedCode = "E";

    static get code() {
        return this._code;
    }

    static get simplifiedCode(): string {
        return this._simplifiedCode;
    }

    protected constructor() {
        super(WorldInteraction._code, WorldInteraction._simplifiedCode);
    }

    public abstract get description(): string

    public abstract get mesh():AbstractMesh | undefined;

}