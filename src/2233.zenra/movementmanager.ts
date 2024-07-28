class MovementManager {
  private isMove = false;
  private x: number;
  private y: number;
  private readonly container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.onmousedown = this.onMouseDown;
    this.container.onmousemove = this.onMouseMove;
    this.container.onmouseup = this.onMouseUp;
  }

  public onMouseDown(e: MouseEvent) {
    this.isMove = true;
    this.x = e.pageX - parseInt(this.container.style.left);
    this.y = e.pageY - parseInt(this.container.style.top);
  }

  public onMouseMove(e: MouseEvent) {
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

  public onMouseUp(_: MouseEvent) {
    this.isMove = false;
  }
}

export { MovementManager };
