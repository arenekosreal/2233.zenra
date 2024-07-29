class MovementManager {
  private isMove = false;
  private isSet = false;
  private x = -1; // e.elementX
  private y = -1; // e.elementY
  private readonly container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public overrideHandlers() {
    if (!this.isSet) {
      console.log('注册移动回调');
      this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
      this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
      this.container.addEventListener('mouseup', this.onMouseUp.bind(this));
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
      this.container.removeEventListener('mouseup', this.onMouseUp.bind(this));
      this.container.removeEventListener(
        'mousemove',
        this.onMouseMove.bind(this),
      );
      this.container.removeEventListener(
        'mousedown',
        this.onMouseDown.bind(this),
      );
      document.removeEventListener(
        'mouseup',
        this.onDocumentMouseUp.bind(this),
      );
      document.removeEventListener(
        'mouseleave',
        this.onDocumentMouseLeave.bind(this),
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
      const maxPageLeft = window.innerWidth - this.container.offsetWidth;
      const maxPageTop = window.innerHeight - this.container.offsetHeight;
      const bondingClientRect = this.container.getBoundingClientRect();
      const targetPageLeft = bondingClientRect.left + x;
      const targetPageTop = bondingClientRect.top + y;
      if (
        targetPageLeft >= 0 &&
        targetPageLeft <= maxPageLeft &&
        targetPageTop >= 0 &&
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
    this.isMove = false;
    this.container.style.cursor = 'auto';
    this.x = -1;
    this.y = -1;
  }

  private onDocumentMouseUp(_: MouseEvent) {}
  private onDocumentMouseLeave(_: MouseEvent) {}
}

export { MovementManager };
