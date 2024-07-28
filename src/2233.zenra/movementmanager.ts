class MovementManager {
  private isMove = false;
  private x: number;
  private y: number;
  private readonly container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public overrideHandlers() {
    this.container.addEventListener('onmousedown', this.onMouseDown);
    this.container.addEventListener('onmousemove', this.onMouseMove);
    this.container.addEventListener('onmouseup', this.onMouseUp);
  }

  public resetHandlers() {
    this.container.removeEventListener('onmouseup', this.onMouseUp);
    this.container.removeEventListener('onmousemove', this.onMouseMove);
    this.container.removeEventListener('onmousedown', this.onMouseDown);
  }

  private onMouseDown(e: MouseEvent) {
    this.isMove = true;
    this.x = e.pageX - parseInt(this.container.style.left);
    this.y = e.pageY - parseInt(this.container.style.top);
  }

  private onMouseMove(e: MouseEvent) {
    if (this.isMove) {
      const x = e.pageX - this.x;
      const y = e.pageY - this.y;
      const wx = window.innerWidth - this.container.clientWidth;
      const dy = window.innerHeight - this.container.clientHeight;
      if (x >= 0 && x <= wx && y > 0 && y <= dy) {
        this.container.style.top = y.toString();
        this.container.style.left = x.toString();
      }
    }
  }

  private onMouseUp(_: MouseEvent) {
    this.isMove = false;
  }
}

export { MovementManager };
