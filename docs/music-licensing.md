# Heeriye flute cover player

The user uploaded the 3:32.84 Heeriye flute-cover WAV file. It has been converted to a web-compatible MP3 (~3 MB).

## Asset installation
Put the MP3 at: public/audio/heeriye-flute-cover.mp3

The uploaded MP3 is supplied separately in a downloadable zip because the GitHub connector cannot read local binary sandbox assets directly. Until this file is uploaded into the repository, the previously included original piano is the fallback.

## Playback
- Sound is enabled by default on first visit and resumed visits.
- The browser tries audible autoplay on hydration. Modern browsers may block it before a gesture; an on-screen header button changes to "Start background music".
- Discover Your Surprise starts or resumes the song directly in the first user-click callback.
- The song loops, remains active between scenes, reduces volume for the Hidden Letter, and grows gently at the Rocket and Finale.
- Explicit mute is respected.
- If the media file is missing, the site uses the old original piano soundtrack rather than silence.
- The browser tests mock a playable WAV response at the MP3 URL; they validate the player, not the presence of the media in the deployed site.

This is a flute cover of a copyrighted composition. Public hosting requires appropriate permission for the recording and musical composition.
