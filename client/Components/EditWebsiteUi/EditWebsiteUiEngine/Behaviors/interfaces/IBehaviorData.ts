export interface IBehaviorData {
    /**
     * The name of this behavior.
     */
    name: string;

    /**
     * Sets the properties of this data from the provided json.
     * @param {any} json The json to set from.
     */
    setFromJson(json: any): void;
}
