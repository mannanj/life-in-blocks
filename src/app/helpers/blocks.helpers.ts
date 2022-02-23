import { compareAsc, format } from "date-fns";
import * as blocks from "../models/blocks.model";
import * as dth from 'src/app/helpers/datetime.helpers';

const TEMP_PROPERTIES = [
    'hovered',
    'now',
    'passed',
    'backupText',
    'editing'
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

export function removeFlags(block: blocks.week): blocks.week {
    return stripContextualData(block);
}

export function setFlags(block: blocks.week): void {
    const thisWeek = dth.getMondayForWeek(new Date());
    if (format(thisWeek, 'MM/dd/yyyy') === format(block.date, 'MM/dd/yyyy')) {
      block.now = true;
      const today = new Date(Date.now()); 
      block?.now ? block.progress = (1 - dth.getWeekProgress(block, today)) : null;
    } else if (compareAsc(thisWeek, block.date) === 1) {
      block.passed = true;
    }
  }