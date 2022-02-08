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
      // scrollDiv.scrollLeft = leftPos - offset.x; // @TODO: Temp disabled.
      debug ? console.log(`scrolled to block ${id}`) : null;
    }
  }

// Zooming, key presses, etc
export const KEYS: {[key: string]: string} = {
  ctrl: 'MetaRight',
  equal: 'Equal',
  minus: 'Minus',
}

export function keyDown(event: KeyboardEvent, keysHeld: string[], zoomLevel: number, _debug?: boolean): {keysHeld: string[], zoomLevel: number} {
  if (event.code === KEYS['ctrl'] && !keysHeld.find(key => key === event.code)) {
    keysHeld.push(event.code);
  }
  if (event.code === KEYS['equal']) {
     if (zoomLevel < 5) {
      zoomLevel = zoomLevel += 0.5;
      _debug? console.log('zooming in', zoomLevel) : null;
     }
     if (!keysHeld.find(key => key === event.code)) {
      keysHeld.push(event.code);
      keysHeld = keysHeld.filter(key => key !== KEYS['minus']);
     }
     stopBrowserZoom(event, keysHeld);
    }
  if (event.code === KEYS['minus']) {
    if (zoomLevel > 0.75) {
      zoomLevel = zoomLevel -= 0.5;
      _debug? console.log('zooming out', zoomLevel) : null;
     }
    if (!keysHeld.find(key => key === event.code)) {
     keysHeld.push(event.code);
     keysHeld = keysHeld.filter(key => key !== KEYS['equal']);
    }
    stopBrowserZoom(event, keysHeld);
  }
  return { keysHeld, zoomLevel };
}

function stopBrowserZoom(event: KeyboardEvent, keysHeld: string[]) {
  if (keysHeld.indexOf(KEYS['ctrl']) > -1 && (keysHeld.indexOf(KEYS['equal']) > -1 || keysHeld.indexOf(KEYS['minus']) > -1)) {
    event.preventDefault();
  }

}

export function keyUp(event: KeyboardEvent, keysHeld: string[]): string[] {
  if (event.code === KEYS['ctrl'] && keysHeld.find(key => key === event.code)) {
    keysHeld = keysHeld.filter(key => key !== KEYS['ctrl']);
  }
  if (event.code === KEYS['equal'] && keysHeld.find(key => key === event.code)) {
    keysHeld = keysHeld.filter(key => key !== KEYS['equal']);
  }
  if (event.code === KEYS['minus'] && keysHeld.find(key => key === event.code)) {
    keysHeld = keysHeld.filter(key => key !== KEYS['minus']);
  }
  return keysHeld;
}

export function getPageZoomLevel() {
  return (( window.outerWidth - 10 ) / window.innerWidth) * 100;
}