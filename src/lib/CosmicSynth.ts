export class CosmicSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Oscillators and filters
  private subOsc: OscillatorNode | null = null;
  private padOsc1: OscillatorNode | null = null;
  private padOsc2: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;

  private filter: BiquadFilterNode | null = null;
  private filterGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private feedbackGain: GainNode | null = null;

  private isPlaying = false;
  private currentVolume = 0.35;

  constructor() {
    // Lazy loaded on first user interaction
  }

  private init() {
    if (this.ctx) return;

    try {
      // @ts-ignore
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime); // Fade in on start
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.error("Web Audio API is not supported in this browser:", e);
    }
  }

  public start(episodeId: number) {
    this.init();
    if (!this.ctx || this.isPlaying) return;

    try {
      this.isPlaying = true;

      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // 1. Setup master volume fading in
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(0, now);
        this.masterGain.gain.linearRampToValueAtTime(this.currentVolume, now + 2.5);
      }

      // 2. Main Resonant Low-Pass Filter
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.Q.setValueAtTime(8, now);
      this.filter.frequency.setValueAtTime(220, now);

      // 3. Stereo Echo / Space Delay
      this.delayNode = this.ctx.createDelay(2.0);
      this.feedbackGain = this.ctx.createGain();

      // Delay time (cosmic echo rate)
      this.delayNode.delayTime.setValueAtTime(0.65, now);
      this.feedbackGain.gain.setValueAtTime(0.4, now); // feedback strength

      // Connect delay loop
      this.filter.connect(this.delayNode);
      this.delayNode.connect(this.feedbackGain);
      this.feedbackGain.connect(this.delayNode);

      // Connect both filter and delay output to master
      if (this.masterGain) {
        this.filter.connect(this.masterGain);
        this.delayNode.connect(this.masterGain);
      }

      // 4. Create Sub Bass Oscillator (The cosmic CMB microwave background hum)
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = "triangle";

      // 5. Create Space Pads (Rich slow synth chords)
      this.padOsc1 = this.ctx.createOscillator();
      this.padOsc1.type = "sine";

      this.padOsc2 = this.ctx.createOscillator();
      this.padOsc2.type = "sawtooth";

      // 6. Slowly modulate the filter sweep using an LFO (Space breathing)
      this.lfo = this.ctx.createOscillator();
      this.lfo.type = "sine";
      this.lfo.frequency.setValueAtTime(0.08, now); // Extremely slow (8 seconds cycle)

      this.filterGain = this.ctx.createGain();
      this.filterGain.gain.setValueAtTime(140, now); // sweep range

      // Route LFO -> Filter Gain -> Filter Frequency
      this.lfo.connect(this.filterGain);
      if (this.filter) {
        this.filterGain.connect(this.filter.frequency);
      }

      // Apply specific episode configurations
      this.applyEpisodeSoundProperties(episodeId);

      // Connect oscillators to filter
      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.18, now); // blend pads down to avoid distortion

      this.subOsc.connect(this.filter);
      this.padOsc1.connect(oscGain);
      this.padOsc2.connect(oscGain);
      oscGain.connect(this.filter);

      // Start all nodes
      this.subOsc.start(now);
      this.padOsc1.start(now);
      this.padOsc2.start(now);
      this.lfo.start(now);

    } catch (err) {
      console.error("Failed to start Cosmic Synth:", err);
    }
  }

  private applyEpisodeSoundProperties(episodeId: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    let subFreq = 55.0;  // A1 (Deep cosmic drone)
    let pad1Freq = 110.0; // A2
    let pad2Freq = 165.0; // E3 (Fifth)
    let filterQ = 6.0;
    let delayTime = 0.65;

    switch (episodeId) {
      case 1: // Black Hole - Ultra-deep heavy gravity hum
        subFreq = 41.2;  // E1 (Very low bass)
        pad1Freq = 82.4; // E2
        pad2Freq = 123.5; // B2
        filterQ = 10.0; // Highly resonant and dark
        delayTime = 0.85; // Massive slow echo
        break;
      case 2: // Big Bang - Shifting rising energy
        subFreq = 65.4;  // C2 (A bit brighter)
        pad1Freq = 130.8; // C3
        pad2Freq = 196.0; // G3
        filterQ = 5.0;
        delayTime = 0.45; // Faster echoes representing expansion
        break;
      case 3: // String Theory - High resonating harmonics
        subFreq = 73.4;  // D2
        pad1Freq = 220.0; // A3 (higher chime pitch)
        pad2Freq = 293.6; // D4
        filterQ = 12.0; // Singing filter
        delayTime = 0.35; // Fluttering echo
        break;
      case 4: // Dark Matter - Ghostly ambient drone
        subFreq = 48.9;  // G1
        pad1Freq = 97.9;  // G2
        pad2Freq = 146.8; // D3
        filterQ = 8.0;
        delayTime = 0.95; // Incredibly vast delay
        break;
      case 5: // Entropy / Heat Death - Decaying slowly swept pad
        subFreq = 36.7;  // D1 (Lowest sub hum)
        pad1Freq = 73.4;  // D2
        pad2Freq = 110.0; // A2
        filterQ = 4.0;   // Very soft, unresonant
        delayTime = 1.2;  // Extremely long decaying echo
        break;
    }

    if (this.subOsc) this.subOsc.frequency.setValueAtTime(subFreq, now);
    if (this.padOsc1) this.padOsc1.frequency.setValueAtTime(pad1Freq, now);
    if (this.padOsc2) this.padOsc2.frequency.setValueAtTime(pad2Freq, now);
    if (this.filter) this.filter.Q.setValueAtTime(filterQ, now);
    if (this.delayNode) this.delayNode.delayTime.setValueAtTime(delayTime, now);
  }

  public setEpisode(episodeId: number) {
    if (!this.isPlaying) return;
    this.applyEpisodeSoundProperties(episodeId);
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.ctx && this.masterGain && this.isPlaying) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.currentVolume, now + 0.2);
    }
  }

  public stop() {
    if (!this.isPlaying || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Fade out Master to avoid speaker clicks
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0, now + 1.2);
      }

      // Stop sources after fading out
      setTimeout(() => {
        if (!this.isPlaying) return; // Prevent double stop race condition

        try {
          if (this.subOsc) { this.subOsc.stop(); this.subOsc.disconnect(); }
          if (this.padOsc1) { this.padOsc1.stop(); this.padOsc1.disconnect(); }
          if (this.padOsc2) { this.padOsc2.stop(); this.padOsc2.disconnect(); }
          if (this.lfo) { this.lfo.stop(); this.lfo.disconnect(); }

          if (this.filter) this.filter.disconnect();
          if (this.delayNode) this.delayNode.disconnect();
          if (this.feedbackGain) this.feedbackGain.disconnect();

          this.subOsc = null;
          this.padOsc1 = null;
          this.padOsc2 = null;
          this.lfo = null;
          this.filter = null;
          this.delayNode = null;
          this.feedbackGain = null;
          this.isPlaying = false;
        } catch (innerErr) {
          // Keep safe
        }
      }, 1300);

    } catch (err) {
      console.error("Failed to stop Cosmic Synth safely:", err);
      this.isPlaying = false;
    }
  }
}
