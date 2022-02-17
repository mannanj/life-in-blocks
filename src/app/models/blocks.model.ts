export interface base {
    id: string;
    user: string;
    date: any;
    num: number;
    entries: entry[];
}

export interface entry {
    text: string;
    created: Date;
    edited?: Date;
    isHovered?: boolean;
    isEditing?: boolean;
    backupText?: string;
}
export interface week extends base {
    // Status flags
    isInFs?: boolean;
    isNow?: boolean;
    isHovered?: boolean;
    isInPast?: boolean;
    progress?: number;
}

export interface weeksByYear {
    [key: number]: week[];
}

export interface zoom {
    zoomLevel: number;
}