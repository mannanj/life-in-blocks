export interface appState {
    user: string;
    settings: settings;
    isStarting: boolean; // true when user and settings are loading.
    isLoading: boolean; // true when things are loading like the page, div drawing/view.
}

export interface settings {
    id: string;
    user: string;
    dob: Date;
    zoom: number;
    hasEntriesForYears: number[];
}
