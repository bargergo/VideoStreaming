export {}

declare module 'video.js' {
  export interface VideoJsPlayer {
    httpSourceSelector(): void;
  }
}