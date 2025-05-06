import { KeyboardEventTypes, KeyboardInfo } from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

type KeyAction = (state: boolean) => void;

export class KeyboardEventManager {

    private static _keyStateMap: Map<string, boolean> = new Map();
    private static _keyDownActions: Map<string, Set<KeyAction>> = new Map();
    private static _keyUpActions: Map<string, Set<KeyAction>> = new Map();

    constructor() {
        Game.scene.onKeyboardObservable.add((kbInfo: KeyboardInfo) => {
            const eventKey = kbInfo.event.code;
            if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
                if (!KeyboardEventManager._keyStateMap.get(eventKey)) {
                    KeyboardEventManager._keyStateMap.set(eventKey, true);
                    this.notifyKeyDown(eventKey);
                }
            } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
                KeyboardEventManager._keyStateMap.set(eventKey, false);
                this.notifyKeyUp(eventKey);
            }
        });
    }

    public static registerKeyDown(key: string, action: KeyAction, context?: any): KeyAction {
        const boundAction = context ? action.bind(context) : action;
        if (!this._keyDownActions.has(key)) {
            this._keyDownActions.set(key, new Set());
        }
        this._keyDownActions.get(key)?.add(boundAction);
        return boundAction;
    }

    public static unregisterKeyDown(key: string, action: KeyAction) {
        this._keyDownActions.get(key)?.delete(action);
    }

    public static registerKeyUp(key: string, action: KeyAction, context?: any): KeyAction {
        const boundAction = context ? action.bind(context) : action;
        if (!this._keyUpActions.has(key)) {
            this._keyUpActions.set(key, new Set());
        }
        this._keyUpActions.get(key)?.add(boundAction);
        return boundAction;
    }

    public static unregisterKeyUp(key: string, action: KeyAction) {
        this._keyUpActions.get(key)?.delete(action);
    }

    public static isKeyPressed(key: string): boolean {
        return this._keyStateMap.get(key) ?? false;
    }

    private notifyKeyDown(key: string) {
        const actions = KeyboardEventManager._keyDownActions.get(key);
        actions?.forEach(action => action(true));
    }

    private notifyKeyUp(key: string) {
        const actions = KeyboardEventManager._keyUpActions.get(key);
        actions?.forEach(action => action(false));
    }
}
