import { Howl } from 'howler';

export type MusicTrack = 'IDLE' | 'PLAYING';

export type SoundEffect = 'BLOCK_TOGGLE' | 'NONE';

const MUSIC_TRACKS: Map<MusicTrack, Howl> = new Map<MusicTrack, Howl>([
  ['IDLE',    new Howl({ src: ['audio/Funky-Puzzler.mp3', 'audio/Funky-Puzzler.webm'], format: ['mp3', 'webm'], loop: true, autoplay: true })],
]);

const SOUND_EFFECTS: Map<SoundEffect, Howl> = new Map<SoundEffect, Howl>([
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-50.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-49.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-48.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-47.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-46.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-45.wav'], format: ['wav'] })],
  ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-44.wav'], format: ['wav'], rate: 1.6 })], // <-- sounds interesting
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-43.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-42.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-41.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-40.wav'], format: ['wav'] })], // <-- sounds interesting
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-39.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-38.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-37.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-35.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-34.wav'], format: ['wav'] })], // <-- sounds interesting
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-32.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-31.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-22.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-21.wav'], format: ['wav'] })], // <-- sounds interesting
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-20.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-19.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-16.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-07.wav'], format: ['wav'] })],
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-03.wav'], format: ['wav'] })], // <-- sounds interesting
  // ['BLOCK_TOGGLE', new Howl({ src: ['audio/DM-CGS-03.mp3', 'audio/DM-CGS-03.webm'], format: ['mp3', 'webm'] })],
])

class Sounds {
  static instance: Sounds;

  musicOn: boolean;
  musicTracks: Map<MusicTrack, Howl>;
  soundFXOn: boolean;
  soundFXs: Map<SoundEffect, Howl>;
  
  static getInstance(): Sounds {
    if (typeof Sounds.instance === 'undefined') {
      Sounds.instance = new Sounds();
    }
    return Sounds.instance;
  }

  private constructor() {
    Howler.autoUnlock = false;

    this.musicOn = false;
    this.musicTracks = MUSIC_TRACKS;
    this.soundFXOn = false;
    this.soundFXs = SOUND_EFFECTS;
  }

  enableMusic(): void {
    this.musicOn = true;
    this.playMusicTrack('IDLE');
  }

  disableMusic(): void {
    this.musicOn = false;
    // Stop all music tracks
    for (const track of this.musicTracks.values()) {
       track.stop();
    }    
  }

  enableSoundFX(): void {
    this.soundFXOn = true;
  }

  disableSoundFX(): void {
    this.soundFXOn = false;
  }

  playMusicTrack(musicTrack: MusicTrack): void {
    if (!this.musicOn) return;
    // console.log('playMusicTrack: ', musicTrack);

    // Stop all music tracks
    for (const track of this.musicTracks.values()) {
       track.stop();
    }

    // Play selected music track
    (this.musicTracks.get(musicTrack) as Howl).play();
  }

  playSoundFX(soundEffect: SoundEffect): void {
    if (!this.soundFXOn) return;
    // console.log('playSoundFx: ', soundEffect);

    // For testing!!!
    // if (soundEffect !== 'HEALTH_SPAWN') return;

    (this.soundFXs.get(soundEffect) as Howl).play();
  }
}

export { Sounds };