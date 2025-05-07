import {KeyboardEventTypes, KeyboardInfo, Scene} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

type KeyAction = (state: boolean) => void;

export class KeyboardEventManager {

    private static _instance: KeyboardEventManager;

    private _keyStateMap: Map<string, boolean> = new Map();
    private _keyDownActions: Map<string, Set<KeyAction>> = new Map();
    private _keyUpActions: Map<string, Set<KeyAction>> = new Map();

    constructor(private _game: Game) {
        KeyboardEventManager._instance = this;
    }

    public init(): void {
        this.scene.onKeyboardObservable.add((kbInfo: KeyboardInfo) => {
            const eventKey = kbInfo.event.key;
            if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
                if (!this._keyStateMap.get(eventKey)) {
                    this._keyStateMap.set(eventKey, true);
                    this.notifyKeyDown(eventKey);
                }
            } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
                this._keyStateMap.set(eventKey, false);
                this.notifyKeyUp(eventKey);
            }
        });
    }

    private get scene(): Scene{
        return this._game.scene;
    }

    public static registerKeyDown(key: string, action: KeyAction, context?: any): KeyAction {
        const boundAction = context ? action.bind(context) : action;
        if (!this._instance._keyDownActions.has(key)) {
            this._instance._keyDownActions.set(key, new Set());
        }
        this._instance._keyDownActions.get(key)?.add(boundAction);
        return boundAction;
    }

    public static unregisterKeyDown(key: string, action: KeyAction) {
        this._instance._keyDownActions.get(key)?.delete(action);
    }

    public static registerKeyUp(key: string, action: KeyAction, context?: any): KeyAction {
        const boundAction = context ? action.bind(context) : action;
        if (!this._instance._keyUpActions.has(key)) {
            this._instance._keyUpActions.set(key, new Set());
        }
        this._instance._keyUpActions.get(key)?.add(boundAction);
        return boundAction;
    }

    public static unregisterKeyUp(key: string, action: KeyAction) {
        this._instance._keyUpActions.get(key)?.delete(action);
    }

    public static isKeyPressed(key: string): boolean {
        return this._instance._keyStateMap.get(key) ?? false;
    }

    private notifyKeyDown(key: string) {
        const actions = this._keyDownActions.get(key);
        actions?.forEach(action => action(true));
    }

    private notifyKeyUp(key: string) {
        const actions = this._keyUpActions.get(key);
        actions?.forEach(action => action(false));
    }
}
