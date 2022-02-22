import * as blocks from "../models/blocks.model";

const TEMP_PROPERTIES = [
    'hovered',
    'fromFs',
    'now',
    'passed'
];

function intersect(a: string[], b: string[]) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}

export function stripContextualData(block: blocks.week): blocks.week {
    const propertiesToDelete = intersect(Object.keys(block), TEMP_PROPERTIES);
    if (propertiesToDelete.length > 0) {
        for (let i = 0; i < propertiesToDelete.length; i++) {
            const keyToDel = propertiesToDelete[i];
            delete (block as any)[keyToDel]; // must cast as any because typescript thinks it knows better, but we know these properties are optional.
        }
    }
    return block;
}