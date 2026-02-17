type Listener = () => void;

class AuthEvents {
  private listeners = new Set<Listener>();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyLogout() {
    this.listeners.forEach((listener) => listener());
  }
}

export const authEvents = new AuthEvents();
