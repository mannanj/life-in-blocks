import * as blocks from 'src/app/models/blocks.model';
export interface settings {
    id: string;
    user: string;
    yearHasData: {[key: number]: boolean};
    currentYearOfData: blocks.week[];
    zoom: zoom;
}

export interface zoom {
    zoomLevel: number;
}