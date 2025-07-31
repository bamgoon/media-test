const mimeGroups: Record<string, string[]> = {
  // ────────── 비디오 포맷 ──────────
  "WebM Video": [
    "video/webm", // 컨테이너 기본형
    "video/webm; codecs=vp8", // VP8
    "video/webm; codecs=vp9", // VP9
    "video/webm; codecs=vp8,opus", // VP8 + Opus
    "video/webm; codecs=vp9,opus", // VP9 + Opus
    "video/webm; codecs=av1,opus", // AV1 + Opus
  ],
  "MP4 Video": [
    "video/mp4", // 컨테이너 기본형
    "video/mp4; codecs=avc1.42E01E", // H.264 Baseline
    "video/mp4; codecs=avc1.4D401E", // H.264 Main
    "video/mp4; codecs=avc1.64001F", // H.264 High
    "video/mp4; codecs=avc1.4D4028", // H.264 High 4.0
    "video/mp4; codecs=avc1.42E01E,mp4a.40.2", // H.264 + AAC
    "video/mp4; codecs=avc1.64001F,mp4a.40.2", // H.264 High + AAC
    "video/mp4; codecs=hvc1.1.6.L93.B0", // H.265/HEVC
    "video/mp4; codecs=av01.0.05M.08", // AV1
  ],
  "Ogg Video": [
    "video/ogg", // 컨테이너 기본형
    "video/ogg; codecs=theora", // Theora
  ],
  "MPEG-TS Video": [
    "video/mp2t", // TS 컨테이너 기본형
    "video/mp2t; codecs=avc1.42E01E", // H.264 TS
    "video/mp2t; codecs=hvc1.1.6.L93.B0", // HEVC TS
  ],
  "Matroska Video": [
    "video/x-matroska", // MKV 컨테이너 기본형
    "video/x-matroska; codecs=avc1,opus", // H.264 + Opus
    "video/x-matroska; codecs=vp9,opus", // VP9 + Opus
  ],
  "QuickTime Video": [
    "video/quicktime", // MOV 컨테이너
  ],
  "Legacy Video": [
    "video/x-msvideo", // AVI 컨테이너
  ],

  // ────────── 오디오 포맷 ──────────
  "WebM Audio": [
    "audio/webm", // 컨테이너 기본형
    "audio/webm; codecs=opus", // Opus
    "audio/webm; codecs=vorbis", // Vorbis
  ],
  "MP3 Audio": [
    "audio/mpeg", // MP3
  ],
  "MP4 Audio": [
    "audio/mp4", // 컨테이너 기본형
    "audio/mp4; codecs=mp4a.40.2", // AAC-LC
  ],
  "Ogg Audio": [
    "audio/ogg; codecs=opus", // Opus
    "audio/ogg; codecs=vorbis", // Vorbis
    "audio/ogg; codecs=flac", // FLAC
  ],
  "WAV Audio": [
    "audio/wav", // PCM WAV
    "audio/x-wav", // PCM WAV alias
    "audio/vnd.wave", // WAV alternate
  ],
  "FLAC Audio": [
    "audio/flac", // FLAC lossless
  ],
  "AMR Audio": [
    "audio/AMR", // AMR Narrowband
    "audio/AMR-WB", // AMR Wideband
  ],
  "WMA Audio": [
    "audio/x-ms-wma", // WMA
  ],

  // ────────── 스트리밍 매니페스트 ──────────
  "HLS Playlists": [
    "application/vnd.apple.mpegurl", // HLS M3U8
    "application/x-mpegurl", // HLS 대체
  ],
  "MPEG-DASH Manifests": [
    "application/dash+xml", // MPEG-DASH
  ],
  "Smooth Streaming Manifests": [
    "application/vnd.ms-sstr+xml", // Microsoft Smooth Streaming
  ],
};

export default function MimeTypePage() {
  const checkPlayback = (mimeType: string) => {
    const videoEl = document.createElement("video");
    return videoEl.canPlayType(mimeType) !== "";
  };

  const checkRecording = (mimeType: string) => {
    return typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mimeType);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">MIME 타입 지원 여부 확인</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        각 운영체제 및 브라우저에서 지원하는 MIME 타입을 확인합니다.
      </p>

      <div className="w-full max-w-4xl overflow-x-auto">
        {Object.entries(mimeGroups).map(([groupName, mimeTypes]) => (
          <section key={groupName} className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">{groupName}</h2>
            <table className="table-auto w-full border-collapse shadow-md">
              <thead>
                <tr className="bg-gray-600 text-white ">
                  <th className="border border-gray-600 px-4 py-2 ">번호</th>
                  <th className="border border-gray-600 px-4 py-2">MIME Type</th>
                  <th className="border border-gray-600 px-4 py-2">재생 가능</th>
                  <th className="border border-gray-600 px-4 py-2">녹화 가능</th>
                </tr>
              </thead>
              <tbody>
                {mimeTypes.map((mimeType, idx) => {
                  const playback = checkPlayback(mimeType);
                  const recording = checkRecording(mimeType);
                  return (
                    <tr key={mimeType} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border px-4 py-2 text-center">{idx + 1}</td>
                      <td className="border px-4 py-2 text-center">{mimeType}</td>
                      <td
                        className={`border px-4 py-2 text-center font-bold border-gray-600 ${
                          playback ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {playback ? "O" : "X"}
                      </td>
                      <td
                        className={`border px-4 py-2 text-center font-bold border-gray-600 ${
                          recording ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {recording ? "O" : "X"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    </div>
  );
}
