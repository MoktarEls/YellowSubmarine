import {AbstractDialogueNode} from "@/YellowSubmarine/dialogue system/nodes/AbstractDialogueNode";

export abstract class AbstractDialogueNodeUI<T extends AbstractDialogueNode<any, any, any>>{
    // TODO : Put in there all the logic that is shared across any dialogue node ui
    // TODO : Creates extension of this class for every types of dialogue node that need a specific logic
    // TODO : Logic shared : - Writing Main Text, With animation, And sound playing
    // TODO : Logic shared : - When pressing space, the Text is fully displayed if it wasn't the case or the dialogue advance
    // TODO : Logic shared : - Outline and Background color
    // TODO : Logic shared : - Uses BBTextBlocks instead of TextBlocks
    // TODO : Logic shared : - Shows

}