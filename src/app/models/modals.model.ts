import * as iBlock from "./blocks.model";

export enum eType {
    year = 'YEAR',
    day = 'DAY',
    none = 'NONE'
}

export interface base {
    name: string;
    id: string;
    type: eType;
    headerText: string;
    block: iBlock.week | iBlock.day;
}