export interface base {
    id: string;
    date: any;
    num: number;
    journal: any;
    summary: any;
}

export interface week extends base {
    // Status flags
    isInFs?: boolean;
    isNow?: boolean;
    isHovered?: boolean;
    isInPast?: boolean;
}

export interface weeksByYear {
    [key: number]: week[];
}