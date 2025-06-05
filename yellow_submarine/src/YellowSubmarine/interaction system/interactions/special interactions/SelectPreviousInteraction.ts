import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {
    InteractionManagerInteraction
} from "@/YellowSubmarine/interaction system/interactions/special interactions/InteractionManagerInteraction";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";

export class SelectPreviousInteraction<T extends AbstractInteraction> extends InteractionManagerInteraction<T>{

    constructor(interactionManager: InteractionManager<T>, code?: string, simplifiedCode?: string) {
        super(interactionManager, code, simplifiedCode);
    }

    protected _start(): void {
        this._interactionManager.selectPreviousInteraction();
        this.endOnNextFrame();
    }

}