import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";

export abstract class InteractionManagerInteraction<T extends AbstractInteraction> extends AbstractInteraction{

    constructor(protected _interactionManager: InteractionManager<T>, code?: string, simplifiedCode?: string) {
        super(code, simplifiedCode);
    }

}