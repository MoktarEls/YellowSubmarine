import {WorldInteraction} from "@/YellowSubmarine/interaction system/interactions/WorldInteraction";
import {UI} from "@/YellowSubmarine/ui system/UI";
import {Control} from "@babylonjs/gui";
import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";

export class WorldInteractionUI extends UI<WorldInteraction>{

    constructor() {
        super();
        InteractionManager.instance.onInteractionAvailable.add(() => {
            // show la bulle ou pas show la bulle
        })
    }

    get controlNode(): Control {
        throw new Error;
    }

}