/* ==============================
src/utils/audioPool.ts v1.0.0
- Loads wav samples into AudioBuffer and provides playAudio(id, opts)
============================== */

export default class AudioPool {
    ctx: AudioContext;
    buffers: Record<string, AudioBuffer>;
    masterGain: GainNode;


    constructor(context?: AudioContext) {
        this.ctx = context || new (window.AudioContext || (window as any).webkitAudioContext)();
        this.buffers = {};
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = 0.6;
    }


    async loadSamples(map: Record<string, string>) {
        const keys = Object.keys(map);
        await Promise.all(keys.map(async (k) => {
            const res = await fetch(map[k]);
            const arrayBuffer = await res.arrayBuffer();
            this.buffers[k] = await this.ctx.decodeAudioData(arrayBuffer);
        }));
    }


    setVolume(v: number) {
        this.masterGain.gain.setValueAtTime(v, this.ctx.currentTime);
    }


    play(id: string, opts: { volume?: number; playbackRate?: number } = {}) {
        const buffer = this.buffers[id];
        if (!buffer) return;
        const src = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        src.buffer = buffer;
        src.playbackRate.value = opts.playbackRate ?? 1;
        gain.gain.value = opts.volume ?? 1;
        src.connect(gain);
        gain.connect(this.masterGain);
        src.start(0);
    }
}