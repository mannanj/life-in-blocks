export function scrollToBlock(id: string, scrollId: string, offset: {x: number, y: number}, debug?: boolean) {
    const activeBlock = document.getElementById(id);
    const topPos = activeBlock?.offsetTop ? activeBlock.offsetTop : 0;
    const leftPos = activeBlock?.offsetLeft ? activeBlock.offsetLeft : 0;
    const scrollDiv = document.getElementById(scrollId);
    debug ? console.log(`activeBlock ${activeBlock}`) : null;
    debug ? console.log(`topPos ${topPos}`) : null;
    debug ? console.log(`leftPos ${leftPos}`) : null;
    debug ? console.log(`scrollDiv ${scrollDiv}`) : null;
    if (scrollDiv && activeBlock) {
      scrollDiv.scrollTop = topPos - offset.y;
      scrollDiv.scrollLeft = leftPos - offset.x;
      debug ? console.log(`scrolled to block ${id}`) : null;
    }
  }

// compute block size based on zoomLevel
const base = 30;
export function getBlocksize(zoom: number): number {
  switch(zoom) { 
    case 0.5: {
      return 30 * 0.5; 
    }
    case 1.5: {
      return 30 * 1.5; 
      break; 
    }
    case 2.5: {
      return 30 * 2.5; 
      break; 
    }
    case 3.5: {
      return 30 * 3.5; 
      break; 
    }
    case 4.5: {
      return 30 * 4.5; 
      break; 
    }
    case 5.5: {
      return 30 * 5.5; 
      break; 
    }
    case 6.5: {
      return 30 * 6.5; 
    }
    default: { 
      return 30 * 0.5; 
    }
  }
}

export function confirmChanges(): boolean {
  return confirm('You will lose all unsaved changes, continue?');
}
  

// Zooming, key presses, etc
export const KEYS: {[key: string]: string} = {
  ctrl: 'MetaRight',
  equal: 'Equal',
  minus: 'Minus',
  escape: 'Escape'
}