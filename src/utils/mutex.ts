export class Mutex {
    private _waiting: Array<(release: () => void) => void> = [];
    private _locked = false;

    async acquire(): Promise<() => void> {
        return new Promise<() => void>((res) => {
            const waiter = (release: () => void) => res(release);
            this._waiting.push(waiter);
            if (!this._locked) this._dispatch();
        });
    }

    private _dispatch() {
        if (this._locked) return;
        const waiter = this._waiting.shift();
        if (!waiter) return;
        this._locked = true;
        waiter(() => {
            this._locked = false;
            this._dispatch();
        });
    }
}
