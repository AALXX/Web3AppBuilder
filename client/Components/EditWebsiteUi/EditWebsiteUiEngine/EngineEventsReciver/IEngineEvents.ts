/**
 * An interface which represents an object that holds edito-specific information.
 * Used for loading the first/initial level
 */
export interface IEditorEvents {
    /**
     * listen to evets
     */
    listenToEvents(eventName: string): void;
}
