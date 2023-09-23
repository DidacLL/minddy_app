
enum FAV_TYPE {
    PROJECT,
    TASK,
    NOTE,
    SEARCH
}

export class Favourite {
    id: string;
    type:FAV_TYPE;
    title: string;
    icon: string;
    inBar: boolean;

    constructor(id: string, title: string, icon: string, inBar: boolean, type: FAV_TYPE) {
        this.id = id;
        this.title = title;
        this.icon = icon;
        this.inBar = inBar;
        this.type = type
    }
}