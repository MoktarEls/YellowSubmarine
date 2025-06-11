import {InteractionManager} from "@/YellowSubmarine/interaction system/InteractionManager";
import {WorldInteraction} from "@/YellowSubmarine/world interaction system/interaction/WorldInteraction";
import {Player} from "@/YellowSubmarine/Player";
import {Game} from "@/YellowSubmarine/Game";
import {World} from "@/YellowSubmarine/World";
import {KeyboardEventTypes, KeyboardInfo} from "@babylonjs/core";

export class WorldInteractionManager extends InteractionManager<WorldInteraction>{

    constructor() {
        super();
        Game.player.onMouseWheelScrolledObservable.add((wheelEvent) => {
            if(wheelEvent.deltaY > 0){
                World.instance.worldInteractionManager.selectNextInteraction();
            }
            else if(wheelEvent.deltaY < 0){
                World.instance.worldInteractionManager.selectPreviousInteraction();
            }
        })
        Game.player.onAnyKeyIsPressedObservable.add((keyboardInfo) => {
            if(
                keyboardInfo.event.code === WorldInteraction.code
                && keyboardInfo.type === KeyboardEventTypes.KEYUP
            ){
                World.instance.worldInteractionManager.startSelectedInteraction();
            }
        })
    }

}