class MovementManager {
  private isMove = false;
  private isSet = false;
  private x = -1; // e.elementX
  private y = -1; // e.elementY
  private readonly container: HTMLElement;

  public get isMoving() {
    return this.isMove;
  }

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public overrideHandlers() {
    if (!this.isSet) {
      console.log('注册移动回调');
      this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
      this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
      this.container.addEventListener('mouseup', this.onMouseUp.bind(this));
      this.container.addEventListener(
        'mouseleave',
        this.onMouseLeave.bind(this),
      );
      document.addEventListener('mouseup', this.onDocumentMouseUp.bind(this));
      document.addEventListener(
        'mouseleave',
        this.onDocumentMouseLeave.bind(this),
      );
      this.isSet = true;
    }
  }

  public resetHandlers() {
    if (this.isSet) {
      console.log('移除移动回调');
      document.removeEventListener(
        'mouseleave',
        this.onDocumentMouseLeave.bind(this),
      );
      document.removeEventListener(
        'mouseup',
        this.onDocumentMouseUp.bind(this),
      );
      this.container.removeEventListener(
        'mouseleave',
        this.onMouseLeave.bind(this),
      );
      this.container.removeEventListener('mouseup', this.onMouseUp.bind(this));
      this.container.removeEventListener(
        'mousemove',
        this.onMouseMove.bind(this),
      );
      this.container.removeEventListener(
        'mousedown',
        this.onMouseDown.bind(this),
      );

      this.isSet = false;
    }
  }

  private onMouseDown(e: MouseEvent) {
    this.isMove = true;
    this.container.style.cursor = 'grab';
    this.x = e.pageX;
    this.y = e.pageY;
  }

  private onMouseMove(e: MouseEvent) {
    if (this.isMove) {
      this.container.style.cursor = 'grabbing';
      const x = e.pageX - this.x; // delta.pageX
      const y = e.pageY - this.y; // delta.pageY
      const bondingClientRect = this.container.getBoundingClientRect();
      const parentBondingClientRect =
        this.container.parentElement.getBoundingClientRect();
      const minPageLeft = parentBondingClientRect.left;
      const maxPageLeft = window.innerWidth - this.container.offsetWidth;
      const minPageTop = parentBondingClientRect.top;
      const maxPageTop = window.innerHeight - this.container.offsetHeight;
      const targetPageLeft = bondingClientRect.left + x;
      const targetPageTop = bondingClientRect.top + y;
      if (
        targetPageLeft >= minPageLeft &&
        targetPageLeft <= maxPageLeft &&
        targetPageTop >= minPageTop &&
        targetPageTop <= maxPageTop
      ) {
        this.container.style.left = `${targetPageLeft}px`;
        this.container.style.top = `${targetPageTop}px`;
      }
      this.x = e.pageX;
      this.y = e.pageY;
    }
  }

  private onMouseUp(_: MouseEvent) {
    this.container.style.cursor = 'auto';
    this.x = -1;
    this.y = -1;
    this.isMove = false;
  }

  private onMouseLeave(_: MouseEvent) {
    this.onMouseUp(_);
  }

  private onDocumentMouseUp(_: MouseEvent) {
    this.onMouseUp(_);
  }
  private onDocumentMouseLeave(_: MouseEvent) {
    this.onMouseUp(_);
  }
}

export { MovementManager };
