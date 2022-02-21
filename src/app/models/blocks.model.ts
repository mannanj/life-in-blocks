export interface blocksState {
    years: years;
    yearsLoading: number[]; // track which years are still loading.
    isEditing: boolean; // true when any block is being edited.
}
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
    isLoading?: boolean; // true when the week is waiting on a db request.
    isEditing?: boolean;
    progress?: number;
}

export interface year {
    [num: number]: week; // the key is week num.
}

export interface years {
    [key: number]: year;
}