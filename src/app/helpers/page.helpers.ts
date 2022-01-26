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