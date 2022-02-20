export interface appState {
    user: string;
    settings: settings;
    isStarting: boolean;
}

export interface settings {
    id: string;
    user: string;
    dob: Date;
    zoom: number;
    yearHasData: number[];
}
