import React, { useRef, FC, useEffect } from 'react';
import {
  AudioContext,
  AudioManager,
  AudioRecorder,
  RecorderAdapterNode,
  AudioBufferSourceNode,
  AudioBuffer,
} from 'react-native-audio-api';

// import { Container, Button } from '../../components';
import { View, Text, Button } from 'react-native';
// import { colors } from '../../styles';

const SAMPLE_RATE = 16000;

const Record = () => {
  const recorderRef = useRef(null);
  const aCtxRef = useRef(null);
  const recorderAdapterRef = useRef(null);
  const audioBuffersRef = useRef([]);
  const sourcesRef = useRef([]);

  useEffect(() => {
    AudioManager.setAudioSessionOptions({
      iosCategory: 'playAndRecord',
      iosMode: 'spokenAudio',
      iosOptions: ['defaultToSpeaker', 'allowBluetoothA2DP'],
    });

    AudioManager.requestRecordingPermissions();

    recorderRef.current = new AudioRecorder({
      sampleRate: SAMPLE_RATE,
      bufferLengthInSamples: SAMPLE_RATE,
    });
  }, []);

  const startEcho1 = () => {
    if (!recorderRef.current) {
      console.error('AudioContext or AudioRecorder is not initialized');
      return;
    }

    aCtxRef.current = new AudioContext({ sampleRate: SAMPLE_RATE });
    recorderAdapterRef.current = aCtxRef.current.createRecorderAdapter();
    recorderAdapterRef.current.connect(aCtxRef.current.destination);
    recorderRef.current.connect(recorderAdapterRef.current);

    recorderRef.current.onAudioReady((event) => {
      const { buffer, numFrames, when } = event;

      console.log(
        'Audio recorder buffer ready:',
        buffer.duration,
        numFrames,
        when
      );
    });

    recorderRef.current.start();
    console.log('Recording started');
    console.log('Audio context state:', aCtxRef.current.state);
    if (aCtxRef.current.state === 'suspended') {
      console.log('Resuming audio context');
      aCtxRef.current.resume();
    }
  };

  /// This stops only the recording, not the audio context
  const stopEcho1 = () => {
    if (!recorderRef.current) {
      console.error('AudioRecorder is not initialized');
      return;
    }
    recorderRef.current.stop();
    aCtxRef.current = null;
    recorderAdapterRef.current = null;
    console.log('Recording stopped');
  };


  const startEcho2 = () => {
    if (!recorderRef.current) {
      console.error('AudioContext or AudioRecorder is not initialized');
      return;
    }

    // aCtxRef.current = new AudioContext({ sampleRate: SAMPLE_RATE });
    // recorderAdapterRef.current = aCtxRef.current.createRecorderAdapter();
    // recorderAdapterRef.current.connect(aCtxRef.current.destination);
    // recorderRef.current.connect(recorderAdapterRef.current);

    recorderRef.current.onAudioReady((event) => {
      const { buffer, numFrames, when } = event;

      console.log(
        'Audio recorder buffer ready:',
        buffer.duration,
        numFrames,
        when
      );
    });

    recorderRef.current.start();
    console.log('Recording started');
    // console.log('Audio context state:', aCtxRef.current.state);
    // if (aCtxRef.current.state === 'suspended') {
    //   console.log('Resuming audio context');
    //   aCtxRef.current.resume();
    // }
  };

  /// This stops only the recording, not the audio context
  const stopEcho2 = () => {
    if (!recorderRef.current) {
      console.error('AudioRecorder is not initialized');
      return;
    }
    recorderRef.current.stop();
    aCtxRef.current = null;
    recorderAdapterRef.current = null;
    console.log('Recording stopped');
  };


  return (
    <View style={{ gap: 40 }}>
      <Text style={{ color: 'white', fontSize: 24, textAlign: 'center' }}>
        Sample rate: {SAMPLE_RATE}
      </Text>
      <View style={{ alignItems: 'center', justifyContent: 'center', gap: 5 }}>
        <Text style={{ color: 'white', fontSize: 24 }}>Echo example</Text>
        <Button title="Start Recording 1" onPress={startEcho1} />
        <Button title="Stop Recording 1" onPress={stopEcho1} />
        <Button title="Start Recording 2" onPress={startEcho2} />
        <Button title="Stop Recording 2" onPress={stopEcho2} />
      </View>
    </View>
  );
};

export default Record;