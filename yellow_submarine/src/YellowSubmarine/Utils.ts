import {ImportMeshAsync, ImportMeshOptions, Scene} from "@babylonjs/core";
import {Game} from "@/YellowSubmarine/Game";

export type CtorArgsChain<
    BaseType,
    T extends unknown[] = [],
> = T extends [infer C, ...infer R]
    ? C extends (new (...args: infer A) => infer I)
        ? I extends BaseType
            ? R extends [...A, ...infer R]
                ? R extends [unknown, ...unknown[]]
                    ? [...CtorArgsChain<BaseType, [C, ...A]>, ...CtorArgsChain<BaseType, [...R]>]
                    : [type: C, ...args:A]
                : [type:C, ...args:A]
            : [ new (...args: unknown[]) => unknown, ...unknown[] ]
        : [ new (...args: unknown[]) => unknown, ...unknown[] ]
    : T

export class Utils {

    public static loadMesh(path: string, scene?: Scene,  options?: ImportMeshOptions) {
        return ImportMeshAsync(path, scene??Game.scene, options);
    }

    public static sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}