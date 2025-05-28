export class QuestStep {

    public description: string;
    public condition: boolean;

    constructor(description: string) {
        this.description = description;
        this.condition = false;
    }

    public validate(){
        this.condition = true;
    }
}