/* ==============================
 src/utils/input.ts v1.0.0
- Centralized keyboard, gamepad, touch handling
============================== */
export class InputManager {
    keys: Record<string, boolean> = {};
    gamepadIndex: number | null = null;


    constructor() {
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onGamepadConnected = this._onGamepadConnected.bind(this);
        this._onGamepadDisconnected = this._onGamepadDisconnected.bind(this);


        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
        window.addEventListener('gamepadconnected', this._onGamepadConnected);
        window.addEventListener('gamepaddisconnected', this._onGamepadDisconnected);
    }


    _onKeyDown(e: KeyboardEvent) { this.keys[(e as any).key] = true; }
    _onKeyUp(e: KeyboardEvent) { this.keys[(e as any).key] = false; }
    _onGamepadConnected(e: GamepadEvent) { this.gamepadIndex = e.gamepad.index; }
    _onGamepadDisconnected(e: GamepadEvent) { if (this.gamepadIndex === e.gamepad.index) this.gamepadIndex = null; }


    pollGamepad() {
        if (this.gamepadIndex == null) return;
        const gp = navigator.getGamepads()[this.gamepadIndex];
        if (!gp) return;
        if (gp.axes[0] < -0.5) this.keys['ArrowLeft'] = true;
        else if (gp.axes[0] > 0.5) this.keys['ArrowRight'] = true;
        else { this.keys['ArrowLeft'] = false; this.keys['ArrowRight'] = false; }
        if (gp.buttons[0].pressed) this.keys[' '] = true;
    }


    destroy() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
        window.removeEventListener('gamepadconnected', this._onGamepadConnected);
        window.removeEventListener('gamepaddisconnected', this._onGamepadDisconnected);
    }
}