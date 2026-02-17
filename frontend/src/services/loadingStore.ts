type Listener = (active: boolean) => void;

class LoadingStore {
  private active = false;
  private count = 0;
  private listeners = new Set<Listener>();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.active);
    return () => this.listeners.delete(listener);
  }

  get() {
    return this.active;
  }

  start() {
    this.count += 1;
    if (!this.active) {
      this.active = true;
      this.emit();
    }
  }

  stop() {
    this.count = Math.max(0, this.count - 1);
    if (this.count === 0 && this.active) {
      this.active = false;
      this.emit();
    }
  }

  private emit() {
    this.listeners.forEach((listener) => listener(this.active));
  }
}

export const loadingStore = new LoadingStore();
