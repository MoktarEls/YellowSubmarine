import {Submarine} from "@/YellowSubmarine/Submarine";
import {SubmarineCamera} from "@/YellowSubmarine/SubmarineCamera";
import {World} from "@/YellowSubmarine/World";
import {Game} from "@/YellowSubmarine/Game";
import {KeyboardEventTypes, KeyboardInfo} from "@babylonjs/core";

export class Player {

    private static _instance: Player;

    public static get instance() {
        return this._instance;
    }

    private _isForwardPressed = false;
    private _isBackwardPressed = false;
    private _isLeftPressed = false;
    private _isRightPressed = false;

    constructor() {
        Player._instance = this;
        this.registerKeyboardInputs();
    }

    public isMoveForwardPressed(): boolean {
        return this._isForwardPressed;
    }

    public isMoveBackwardPressed(): boolean {
        return this._isBackwardPressed;
    }

    public isTurnLeftPressed(): boolean {
        return this._isLeftPressed;
    }

    public isTurnRightPressed(): boolean {
        return this._isRightPressed;
    }

    private registerKeyboardInputs(){
        const scene = Game.scene;
        scene.onKeyboardObservable.add( (eventData) => {
            const state = eventData.type === KeyboardEventTypes.KEYDOWN;
            if(eventData.event.key === "z"){
                this._isForwardPressed = state;
            }
            else if(eventData.event.key === "s"){
                this._isBackwardPressed = state;
            }
            else if(eventData.event.key === "q"){
                this._isLeftPressed = state;
            }
            else if(eventData.event.key === "d"){
                this._isRightPressed = state;
            }
        } );
    }

}