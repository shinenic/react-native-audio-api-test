import React, { useRef, FC, useEffect, useState } from "react";
import {
  AudioContext,
  AudioManager,
  AudioRecorder,
} from "react-native-audio-api";

import { View, Text, Button } from "react-native";

const SAMPLE_RATE = 16000;

const Record1 = () => {
  const recorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    (async () => {
      AudioManager.setAudioSessionOptions({
        iosCategory: "playAndRecord",
        iosMode: "spokenAudio",
        iosOptions: ["defaultToSpeaker", "allowBluetoothA2DP"],
      });

      AudioManager.requestRecordingPermissions();

      await new Promise((resolve) => setTimeout(resolve, 1000));

      recorderRef.current = new AudioRecorder({
        sampleRate: SAMPLE_RATE,
        bufferLengthInSamples: SAMPLE_RATE * 1,
      });

      recorderRef.current.onAudioReady((event) => {
        const { buffer, numFrames, when } = event;

        console.log("Audio recorder buffer:", buffer.duration, numFrames, when);
      });
    })();
  }, []);

  const handleRecord = async () => {
    if (isRecording) {
      console.log("Stopping recording");
      recorderRef.current.stop();
      setIsRecording(false);
    } else {
      console.log("Starting recording");
      recorderRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <View style={{ gap: 40 }}>
      <Text style={{ color: "white", fontSize: 24, textAlign: "center" }}>
        Sample rate: {SAMPLE_RATE}
      </Text>
      <View style={{ alignItems: "center", justifyContent: "center", gap: 5 }}>
        <Text style={{ color: "white", fontSize: 24 }}>Player example</Text>
        <Button
          title={
            isRecording
              ? "Stop Recording (with AudioContext)"
              : "Start Recording (with AudioContext)"
          }
          onPress={handleRecord}
        />
      </View>
    </View>
  );
};

export default Record1;
