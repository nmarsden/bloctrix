import { Howl } from 'howler';

export type MusicTrack = 'IDLE' | 'PLAYING';

export type SoundEffect = 'BLOCK_TOGGLE' | 'LEVEL_COMPLETED' | 'NONE';

const MUSIC_TRACKS: Map<MusicTrack, Howl> = new Map<MusicTrack, Howl>([
  ['IDLE',    new Howl({ src: ['audio/Funky-Puzzler.mp3', 'audio/Funky-Puzzler.webm'], format: ['mp3', 'webm'], loop: true, autoplay: true })],
]);

class Sounds {
  static instance: Sounds;

  musicOn: boolean;
  musicTracks: Map<MusicTrack, Howl>;
  soundFXOn: boolean;
  soundFXs: Map<SoundEffect, Howl>;
  numSoundFXPlaying: number;
  
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
    this.soundFXs = this.initSoundFXs();
    this.numSoundFXPlaying = 0;
  }

  onSoundFxPlay = () => {
    this.numSoundFXPlaying++;
  }

  onSoundFxEnd = () => {
    this.numSoundFXPlaying--;
  }

  newSoundFx = (filename: string, volume: number): Howl => {
    return new Howl({ 
      src: [`audio/${filename}.mp3`, `audio/${filename}.webm`], 
      format: ['mp3', 'webm'],
      volume: volume,
      onplay: this.onSoundFxPlay,
      onend: this.onSoundFxEnd
    });
  }

  initSoundFXs = (): Map<SoundEffect, Howl> => {
    return new Map<SoundEffect, Howl>([
      ['BLOCK_TOGGLE',    this.newSoundFx('DM-CGS-32', 0.2)],
      ['LEVEL_COMPLETED', this.newSoundFx('DM-CGS-26', 1.0)],
    ])
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
    if (!this.soundFXOn || this.numSoundFXPlaying > 2) return;

    // console.log('playSoundFx: ', soundEffect);

    // For testing!!!
    // if (soundEffect !== 'HEALTH_SPAWN') return;

    (this.soundFXs.get(soundEffect) as Howl).play();
  }
}

export { Sounds };