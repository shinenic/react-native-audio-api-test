import React, { useRef, FC, useEffect, useState } from "react";
import {
  AudioContext,
  AudioManager,
  AudioRecorder,
} from "react-native-audio-api";

import { View, Text, Button } from "react-native";

const SAMPLE_RATE = 16000;

const Record = () => {
  const recorderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const cleanupRef = useRef(null);

  useEffect(() => {
    AudioManager.setAudioSessionOptions({
      iosCategory: "playAndRecord",
      iosMode: "spokenAudio",
      iosOptions: ["defaultToSpeaker", "allowBluetoothA2DP"],
    });

    AudioManager.requestRecordingPermissions();

    recorderRef.current = new AudioRecorder({
      sampleRate: SAMPLE_RATE,
      bufferLengthInSamples: SAMPLE_RATE,
    });
  }, []);

  const handlePlay = async () => {
    if (isLoading) return;

    if (isPlaying) {
      cleanupRef.current();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    const audioContext = new AudioContext();

    const audioBuffer = await fetch(
      "https://software-mansion.github.io/react-native-audio-api/audio/music/example-music-01.mp3"
    )
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer));

    const playerNode = audioContext.createBufferSource();
    playerNode.buffer = audioBuffer;

    playerNode.connect(audioContext.destination);
    playerNode.start(audioContext.currentTime);

    setIsLoading(false);
    setIsPlaying(true);

    cleanupRef.current = () => {
      playerNode.disconnect();
      cleanupRef.current = null;
    };
  };

  return (
    <View style={{ gap: 40 }}>
      <Text style={{ color: "white", fontSize: 24, textAlign: "center" }}>
        Sample rate: {SAMPLE_RATE}
      </Text>
      <View style={{ alignItems: "center", justifyContent: "center", gap: 5 }}>
        <Text style={{ color: "white", fontSize: 24 }}>Player example</Text>
        <Button
          title={isPlaying ? "Stop Audio" : "Play Audio"}
          onPress={handlePlay}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

export default Record;
