import {Game} from "@/YellowSubmarine/Game";
import {KeyboardEventTypes, KeyboardInfo} from "@babylonjs/core";
import {World} from "@/YellowSubmarine/World";

export class InputManager {

    private static _keys: {[key: string]:boolean};

    constructor() {
        InputManager._keys = {};
        World.scene.onKeyboardObservable.add(this.onKeyboardCallback)
    }

    public static isPressed(key: string) : boolean{
        return this._keys[key];
    }

    private onKeyboardCallback(kbInfo :KeyboardInfo){
        const key = kbInfo.event.code;

        switch (kbInfo.type) {
            case KeyboardEventTypes.KEYDOWN:
                InputManager._keys[key] = true;
                break;
            case KeyboardEventTypes.KEYUP:
                InputManager._keys[key] = false;
                break;
        }
    }



}