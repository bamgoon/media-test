import { useEffect, useState } from "react";

const useSpeechDetection = (audioStream: MediaStream | null, threshold: number) => {
  const [isTalk, setTalk] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0);

  useEffect(() => {
    if (!audioStream) {
      return;
    }
    const audioContext = new AudioContext({ sampleRate: 3000 }); // AudioContext 생성 (샘플링 주파수: 3000Hz)
    const source = audioContext.createMediaStreamSource(audioStream); // MediaStreamSourceNode 생성
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.9;

    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount; // 분석할 주파수 대역 수
    const dataArray = new Uint8Array(bufferLength); // 분석된 주파수 데이터를 저장할 배열

    const analyzeAudioStream = () => {
      analyser.getByteFrequencyData(dataArray); // 주파수 데이터 분석

      // 주파수 데이터의 평균 진폭값 (범위: 0 ~ 255)
      const avgAmplitude = Math.round(dataArray.reduce((acc, val) => acc + val, 0) / bufferLength);
      setVolume(avgAmplitude);
      setTalk(avgAmplitude > threshold);
    };

    const intervalId = setInterval(analyzeAudioStream, 1000 / 30);

    return () => {
      source.disconnect(analyser);
      audioContext.close();
      clearInterval(intervalId);
    };
  }, [audioStream, threshold]);

  return { isTalk, volume };
};

export default useSpeechDetection;
