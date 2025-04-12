export const ensureNumber = (val) => {
  // eslint-disable-next-line no-restricted-globals
  return typeof val === 'number' && !isNaN(val)
}


export class raf {
  private static lastTime = new Date().getTime();
  static default = (callback) => {
    const currentTime = new Date().getTime();
    // 为了使setTimteout的尽可能的接近每秒60帧的效果
    const timeToCall = Math.max(0, 16 - (currentTime - this.lastTime));
    const id = setTimeout(() => {
      callback(currentTime + timeToCall);
    }, timeToCall);
    this.lastTime= currentTime + timeToCall;
    return id;
  }
  static cancel = (id: any) => {
    clearTimeout(id);
  }
}

export const requestAnimationFrame =(cb: any) =>{
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame(cb)
  }

  return raf.default(cb)
}

export const cancelAnimationFrame =(id: any)=> {
  if (window.cancelAnimationFrame) {
    return window.cancelAnimationFrame(id)
  }

  return raf.cancel(id)
}
