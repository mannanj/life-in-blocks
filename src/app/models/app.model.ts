export interface appState {
    settings: settings;
    starting: boolean; // true when user and settings are loading.
    loading: boolean; // true when things are loading like the page, div drawing/view.
}

export interface settings {
    id: string;
    account: any;
    dob: Date;
    zoom: number;
    yearsWithData: number[];
}