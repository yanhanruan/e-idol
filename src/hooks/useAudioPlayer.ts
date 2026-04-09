import { useState } from 'react';
import type { AudioElementsMap, AudioPlayerState } from '../types';

export const useAudioPlayer = (): AudioPlayerState => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<AudioElementsMap>({});

  const toggleAudio = (userId: string) => {
    if (playingAudio === userId) {
      if (audioElements[userId]) {
        audioElements[userId].pause();
      }
      setPlayingAudio(null);
      return;
    }

    Object.keys(audioElements).forEach((id) => {
      if (audioElements[id]) {
        audioElements[id].pause();
      }
    });

    if (!audioElements[userId]) {
      const audio = new Audio(
        'https://d2zsxcb1sxm997.cloudfront.net/uploads/sale_profile/audio/13264/mp3_%E6%96%B0%E8%A6%8F%E9%8C%B2%E9%9F%B3_27.mp3',
      );
      audio.addEventListener('ended', () => setPlayingAudio(null));
      setAudioElements((prev) => ({ ...prev, [userId]: audio }));
      void audio.play();
    } else {
      void audioElements[userId].play();
    }
    setPlayingAudio(userId);
  };

  return { playingAudio, toggleAudio };
};
