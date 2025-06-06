﻿import {AbstractInteraction} from "@/YellowSubmarine/interaction system/interactions/AbstractInteraction";
import {AbstractMesh} from "@babylonjs/core";

export abstract class DialogueInteraction extends AbstractInteraction{
    public abstract get mesh():AbstractMesh | undefined;
}