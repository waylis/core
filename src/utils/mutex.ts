export class Mutex {
    private waiting: Array<(release: () => void) => void> = [];
    private locked = false;

    async acquire(): Promise<() => void> {
        return new Promise<() => void>((res) => {
            const waiter = (release: () => void) => res(release);
            this.waiting.push(waiter);
            if (!this.locked) this.dispatch();
        });
    }

    private dispatch() {
        if (this.locked) return;
        const waiter = this.waiting.shift();
        if (!waiter) return;
        this.locked = true;
        waiter(() => {
            this.locked = false;
            this.dispatch();
        });
    }
}
