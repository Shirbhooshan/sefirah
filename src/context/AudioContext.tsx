"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AudioContextType {
  volume: number;
  setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(
  undefined
);

export function AudioProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [volume, setVolumeState] = useState(70);

  useEffect(() => {
    const savedVolume = localStorage.getItem("sefirah-volume");

    if (savedVolume !== null) {
      setVolumeState(Number(savedVolume));
    }
  }, []);

  const setVolume = (value: number) => {
    setVolumeState(value);
    localStorage.setItem("sefirah-volume", String(value));
  };

  return (
    <AudioContext.Provider value={{ volume, setVolume }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error(
      "useAudio must be used inside AudioProvider"
    );
  }

  return context;
}