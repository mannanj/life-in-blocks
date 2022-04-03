import * as user from 'src/app/models/user.model';
export interface blocksState {
    years: years;
    yearsLoading: number[]; // track which years are still loading.
    editing: boolean; // true when any block is being edited.
    activeBlockId: string;
}
export interface base {
    id: string;
    accountId: string;
    date: any;
    num: number;
    entries: entry[];
}

export interface entry {
    text: string;
    created: Date;
    edited?: Date;
    hovered?: boolean;
    editing?: boolean;
    backupText?: string;
}
export interface week extends base {
    // Status flags
    now?: boolean;
    hovered?: boolean;
    passed?: boolean;
    loading?: boolean; // true when the week is waiting on a db request.
    editing?: boolean;
    progress?: number;
}

export interface year {
    [num: number]: week; // the key is week num.
}

export interface years {
    [key: number]: year;
}