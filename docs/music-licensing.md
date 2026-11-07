# Music integration and licensing

## What's included
The site now plays a **new, original, gentle instrumental piano score** composed as source-code note events. It is **not "Heeriye"**, does not contain its master recording, is not a transcription, and does not sample its melody. This allows the shared website to play music without embedding a copyrighted recording that was never supplied or licensed.

- Starts synchronously on the visitor's "Discover Your Surprise" click, satisfying mobile browser user-gesture requirements.
- Plays continuously across all seven scenes; 8-bar composition loops seamlessly via Web Audio scheduling.
- Header sound control can mute and restart the music and sound effects.
- If the user explicitly mutes the sound before beginning, the invitation does not override that preference.
- The Hidden Letter reduces background volume; the finale gently increases it.
- Background tabs suspend the AudioContext; unmount cleans up timers and audio nodes.
- No external network audio, third-party cookies, API keys, music-streaming integrations or subscription required.

## How to substitute the actual requested song
The commercial song **Heeriye** by Jasleen Royal / Arijit Singh is protected by copyright; an instrumental rendition also may need composition rights. Do not upload or embed it unless you have the necessary permission/license. After a licensed recording is supplied by the user, the music engine can be changed to play that permitted audio file instead of the original Web Audio composition, preserving the same user-gesture, volume and mute experience.

## Verification
Dedicated Playwright tests verify that the opening gesture creates actual Web Audio oscillator nodes, navigation preserves playback state, mute/unmute works, explicit mute is respected and reloading an in-progress chapter does not autoplay. Existing seven-scene Playwright regression coverage remains.
