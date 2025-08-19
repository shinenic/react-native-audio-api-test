import React, { useRef, FC, useEffect, useState } from "react";
import {
  AudioContext,
  AudioManager,
  AudioRecorder,
} from "react-native-audio-api";

import { View, Text, Button } from "react-native";

const SAMPLE_RATE = 16000;

/**
 * I setup the audio context and recorder in the beginning,
 * it causes runtime error: `SetProperty: RPC timeout. Apparently deadlocked. Aborting now.`
 * (only on iOS simulator, the real device works fine)
 */
const Record1 = () => {
  const recorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  /**
   * Case 1:
   * setup audio context then setup recorder
   */
  useEffect(() => {
    (async () => {
      AudioManager.setAudioSessionOptions({
        iosCategory: "playAndRecord",
        iosMode: "spokenAudio",
        iosOptions: ["defaultToSpeaker", "allowBluetoothA2DP"],
      });

      AudioManager.requestRecordingPermissions();

      // do some other stuff
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const _audioContext = new AudioContext();

      // do some other stuff
      await new Promise((resolve) => setTimeout(resolve, 1000));

      recorderRef.current = new AudioRecorder({
        sampleRate: SAMPLE_RATE,
        bufferLengthInSamples: SAMPLE_RATE * 2,
      });

      recorderRef.current.onAudioReady((event) => {
        const { buffer, numFrames, when } = event;

        console.log("Audio recorder buffer:", buffer.duration, numFrames, when);
      });
    })();
  }, []);

  /**
   * Case 2:
   * setup recorder then setup audio context
   */
  // useEffect(() => {
  //   (async () => {
  //     AudioManager.setAudioSessionOptions({
  //       iosCategory: "playAndRecord",
  //       iosMode: "spokenAudio",
  //       iosOptions: ["defaultToSpeaker", "allowBluetoothA2DP"],
  //     });

  //     AudioManager.requestRecordingPermissions();

  //     // do some other stuff
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     recorderRef.current = new AudioRecorder({
  //       sampleRate: SAMPLE_RATE,
  //       bufferLengthInSamples: SAMPLE_RATE * 2,
  //     });

  //     recorderRef.current.onAudioReady((event) => {
  //       const { buffer, numFrames, when } = event;

  //       console.log("Audio recorder buffer:", buffer.duration, numFrames, when);
  //     });

  //     // do some other stuff
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     const _audioContext = new AudioContext();
  //   })();
  // }, []);

  const handlePlay = async () => {
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

    // do something...
    await new Promise((resolve) => setTimeout(resolve, 9000));

    playerNode.disconnect();
  };

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
        <Button title="Play music" onPress={handlePlay} />
      </View>
    </View>
  );
};

export default Record1;
