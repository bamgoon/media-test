import { useEffect, useState } from "react";

export default function useSpeechDetection(audioStream: MediaStream | null, threshold: number) {
  const [isTalk, setTalk] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0);

  useEffect(() => {
    if (!audioStream) return;

    const audioContext = new AudioContext(); // 브라우저 기본 샘플링 주파수 사용 (44100Hz)
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512; // FFT 크기 (frequencyBinCount = 256으로 자동 계산)
    analyser.smoothingTimeConstant = 0.6; // 시간적 평활화 (0.0=즉각반응, 1.0=변화없음)

    const source = audioContext.createMediaStreamSource(audioStream);
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount; // 256개 빈 (fftSize/2)
    const dataArray = new Uint8Array(bufferLength);

    const analyzeAudioStream = () => {
      analyser.getByteFrequencyData(dataArray); // FFT로 주파수 도메인 변환

      const sampleRate = audioContext.sampleRate;
      const nyquistFreq = sampleRate / 2; // 최대 캡처 가능 주파수

      const lowBinIndex = Math.floor((300 * bufferLength) / nyquistFreq); // 300Hz 빈 인덱스
      const highBinIndex = Math.floor((3400 * bufferLength) / nyquistFreq); // 3400Hz 빈 인덱스

      const voiceData = dataArray.slice(lowBinIndex, highBinIndex); // 음성 대역만 추출
      const avgAmplitude = voiceData.reduce((a, b) => a + b, 0) / voiceData.length;

      setVolume(Math.round(avgAmplitude));
      setTalk(avgAmplitude > threshold);
    };

    const intervalId = setInterval(analyzeAudioStream, 1000 / 30);

    return () => {
      source.disconnect();
      audioContext.close();
      clearInterval(intervalId);
    };
  }, [audioStream, threshold]);

  return { isTalk, volume };
}
