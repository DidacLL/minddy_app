import {MinddyObject} from "../dao/MinddyObject";
import MinddyService from "../../minddy.service";

export class MinddyPool<T extends MinddyObject> {
    private _elements: Map<string, T> = new Map<string, T>();
    private _fetchFunction: (id: string, callBack: (json: string) => any,
                             error: (e: any) => void) => any;
    private _parseFunction: (json: string) => T;

    constructor(
        fetchFunction: (id: string,
                        callback: (json: string) => any,
                        error: (e: any) => void) => any,
        parseFunction: (json: string) => T
    ) {
        this._fetchFunction = fetchFunction;
        this._parseFunction = parseFunction;
    }

    addElements(elements: T[]) {
        if (elements && elements.length > 0) elements.map((element: T) => this._elements.set(element.id, element))
    }

    private addElement(element: T) {
       this._elements.set(element.id, element);
        localStorage.setItem(MinddyService.updateFactor(typeof element), JSON.stringify(Array.from(this._elements.values())))
        return this;
    }

    get(id: string, callBack: (element: T) => any, error: (e: any) => any) {
        const saved = this._elements.get(id);
        if (saved) {
            callBack(saved);
        } else {
            try {
                this._fetchFunction(id, (el) => {
                    const val = this._parseFunction(el);
                    if (val) {
                        this.addElement(val);
                        callBack(val);
                    }
                }, error);
            } catch (e) {
                console.log(`POOL unable to load new element: ${id} \n ${(e as Error).name}\n ${(e as Error).message}\n ${(e as Error).cause}\n ${(e as Error).stack}`)
                error(e);
            }
        }
    }

    dropPool() {
        this._elements.clear();
    }

}