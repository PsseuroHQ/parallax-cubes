/* ==============================
 src/utils/input.ts v0.0.2
- Centralized keyboard, gamepad, touch handling
============================== */
export class InputManager {
    keys: Record<string, boolean> = {};
    gamepadIndex: number | null = null;

    constructor() {
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onGPConnect = this._onGPConnect.bind(this);
        this._onGPDisconnect = this._onGPDisconnect.bind(this);

        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
        window.addEventListener('gamepadconnected', this._onGPConnect);
        window.addEventListener('gamepaddisconnected', this._onGPDisconnect);
    }

    _onKeyDown(e: KeyboardEvent) { this.keys[(e as any).key] = true; }
    _onKeyUp(e: KeyboardEvent) { this.keys[(e as any).key] = false; }
    _onGPConnect(e: GamepadEvent) { this.gamepadIndex = e.gamepad.index; }
    _onGPDisconnect(e: GamepadEvent) { if (this.gamepadIndex === e.gamepad.index) this.gamepadIndex = null; }

    pollGamepad() {
        if (this.gamepadIndex == null) return;
        const gp = navigator.getGamepads()[this.gamepadIndex];
        if (!gp) return;
        if (gp.axes[0] < -0.5) { this.keys['ArrowLeft'] = true; this.keys['ArrowRight'] = false; }
        else if (gp.axes[0] > 0.5) { this.keys['ArrowRight'] = true; this.keys['ArrowLeft'] = false; }
        else { this.keys['ArrowLeft'] = false; this.keys['ArrowRight'] = false; }

        if (gp.buttons[0]?.pressed) this.keys[' '] = true;
        else this.keys[' '] = false;
    }

    destroy() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
        window.removeEventListener('gamepadconnected', this._onGPConnect);
        window.removeEventListener('gamepaddisconnected', this._onGPDisconnect);
    }
}