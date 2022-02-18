export interface appState {
    isStarting: boolean;
    user: string;
    settings: settings;
}

export interface settings {
    id: string;
    user: string;
    zoom: number;
    yearHasData: number[];
}
