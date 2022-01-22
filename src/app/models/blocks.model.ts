export interface base {
    id: string;
    date: any;
    blockNo: number;
    journalEntry: any;
    contextText: any;
}

export interface week extends base {
    // Status flags
    isInFs?: boolean;
    isNow?: boolean;
    isHovered?: boolean;
    isInPast?: boolean;
}

export interface day extends base {
    // Status flags
    isInFs?: boolean;
    isNow?: boolean;
    isHovered?: boolean;
    isInPast?: boolean;
    activeBlockNo?: number;
}