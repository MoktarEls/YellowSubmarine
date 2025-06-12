import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {AbstractMesh} from "@babylonjs/core";

export abstract class WorldInteraction extends AbstractInteraction{

    protected constructor() {
        super();
    }

    public abstract get description(): string

    public abstract get mesh():AbstractMesh | undefined;

}