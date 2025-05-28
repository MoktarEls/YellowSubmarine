export class QuestStep {

    public description: string;
    public condition: boolean;

    constructor(description: string, condition: boolean) {
        this.description = description;
        this.condition = condition;
    }

    public validate(){
        this.condition = true;
    }
}