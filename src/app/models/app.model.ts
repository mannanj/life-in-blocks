import * as blocks from 'src/app/models/blocks.model';
export interface settings {
    user: string;
    yearHasData: {[key: number]: boolean};
    currentYearOfData: blocks.week[];
}