export interface NoteRequest {
    noteDTO: {
        id: string,
        name: string,
        body: string
        type: number;
        isVisible: boolean;
    }
    tags: string[];
}