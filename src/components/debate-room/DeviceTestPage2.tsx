import { Trans, useTranslation } from "react-i18next";

import { useContext, useEffect, useRef } from "react";

import { cn } from "@/utils";
import { CameraSet, LanguageSet, MicrophoneSet, SpeakerSet, VirtualBgSet } from "@components";
import { StreamContext } from "@contexts";
import { useDeviceStore } from "@stores";

type DeviceTestPage2Props = {
  isTalk: boolean;
};

function DeviceTestPage2({ isTalk }: DeviceTestPage2Props) {
  const { t } = useTranslation();

  const stream = useContext(StreamContext);

  const isSpeakerOn = useDeviceStore((store) => store.isSpeakerOn);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream && stream.active) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <>
      <div className="align-center-center h-screen flex-col">
        <div className="flex w-[1000px] items-center gap-[20px]">
          <TaejaeLogo />
          <div>
            <p className="typo-xl600">{t("device_test_title")}</p>
            <p className="typo-md400 text-grey-800">
              <Trans i18nKey="device_test_description" components={{ br: <br /> }} />
            </p>
          </div>
        </div>
        <div className="mt-[20px] flex">
          <video
            ref={videoRef}
            autoPlay
            className={cn("h-[522px] w-[696px] rounded border-[4px] object-cover", isTalk && "border-primary-500")}
            muted={!isSpeakerOn}
          />
          <div className="ml-[30px] flex w-[260px] flex-col gap-[16px]">
            <CameraSet />
            <MicrophoneSet />
            <SpeakerSet />
            <VirtualBgSet />
            <LanguageSet />
          </div>
        </div>
      </div>
    </>
  );
}

export default DeviceTestPage2;

function TaejaeLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" id="logo" width="175" height="70" viewBox="0 0 130 52">
      <g id="T">
        <path id="right" d="M0,39V13L13,0H26V13H13V39Z" transform="translate(13 0)" fill="#512b81" />
        <rect id="left" width="13" height="13" fill="#00a497" />
      </g>
      <g id="J" transform="translate(26 13)">
        <path
          id="path"
          d="M176.569,75.285h-13v26h-13v12.768a22.758,22.758,0,0,0,26-22.507Z"
          transform="translate(-150.569 -75.285)"
          fill="#512b81"
        />
      </g>
      <g id="txt" transform="translate(-0.359 0.012)">
        <g id="그룹_3005" data-name="그룹 3005" transform="translate(61.36 12.987)">
          <path
            id="패스_9415"
            data-name="패스 9415"
            d="M56.008,11.855h10.96v2.276h-4.1V25.143H60.112V14.131h-4.1Z"
            transform="translate(-56.008 -11.855)"
            fill="#501d83"
          />
          <path
            id="패스_9416"
            data-name="패스 9416"
            d="M65.367,25.143l4.639-13.288h3.567l4.62,13.288H75.218l-1.007-3.066H69.368l-1.007,3.066Zm8.142-5.213-1.672-5.084h-.093L70.071,19.93Z"
            transform="translate(-55.091 -11.855)"
            fill="#501d83"
          />
          <path
            id="패스_9417"
            data-name="패스 9417"
            d="M78.429,11.855h8.983v2.276H81.2v3.231H86.95v2.276H81.2v3.231h6.229v2.276h-9Z"
            transform="translate(-53.811 -11.855)"
            fill="#501d83"
          />
          <path
            id="패스_9418"
            data-name="패스 9418"
            d="M96.741,11.855v9.269c0,2.579-1.839,4.2-4.528,4.2-2.421,0-4.315-1.266-4.306-3.89h2.772a1.556,1.556,0,0,0,1.663,1.669c1.063,0,1.645-.678,1.645-1.981V11.855Z"
            transform="translate(-52.882 -11.855)"
            fill="#501d83"
          />
          <path
            id="패스_9419"
            data-name="패스 9419"
            d="M97.316,25.143l4.639-13.288h3.567l4.62,13.288h-2.976l-1.007-3.066h-4.843l-1.007,3.066Zm8.142-5.213-1.672-5.084h-.093L102.02,19.93Z"
            transform="translate(-51.96 -11.855)"
            fill="#501d83"
          />
          <path
            id="패스_9420"
            data-name="패스 9420"
            d="M110.378,11.855h8.983v2.276h-6.21v3.231H118.9v2.276h-5.748v3.231h6.229v2.276h-9Z"
            transform="translate(-50.68 -11.855)"
            fill="#501d83"
          />
          <path
            id="패스_9421"
            data-name="패스 9421"
            d="M63.1,33.282a1.688,1.688,0,0,1-3.373,0V28.133h-1.7v5.284c0,1.782,1.347,2.973,3.385,2.968s3.4-1.186,3.4-2.968V28.133H63.1Z"
            transform="translate(-55.811 -10.385)"
            fill="#501d83"
          />
          <path
            id="패스_9422"
            data-name="패스 9422"
            d="M70.839,33.3H70.76l-3.577-5.171H65.688v8.139h1.7V31.1h.068l3.6,5.171h1.471V28.132H70.839Z"
            transform="translate(-55.06 -10.385)"
            fill="#501d83"
          />
          <rect id="사각형_2299" data-name="사각형 2299" width="1.699" height="8.139" transform="translate(19.101 17.748)" fill="#501d83" />
          <path
            id="패스_9423"
            data-name="패스 9423"
            d="M79.639,34.338H79.56l-1.993-6.205h-1.9l2.842,8.138h2.185l2.83-8.138H81.643Z"
            transform="translate(-54.082 -10.385)"
            fill="#501d83"
          />
          <path
            id="패스_9424"
            data-name="패스 9424"
            d="M85.236,32.9h3.52V31.506h-3.52V29.527h3.8V28.132h-5.5v8.139h5.514V34.878H85.236Z"
            transform="translate(-53.31 -10.385)"
            fill="#501d83"
          />
          <path
            id="패스_9425"
            data-name="패스 9425"
            d="M96.121,30.786c0-1.613-1.069-2.653-2.932-2.653H89.974v8.139h1.7V33.383h1.3l1.568,2.889h1.879l-1.744-3.165a2.35,2.35,0,0,0,1.449-2.321m-3.249,1.226h-1.2v-2.5h1.2c1.008.005,1.5.45,1.494,1.27s-.486,1.226-1.494,1.226"
            transform="translate(-52.679 -10.385)"
            fill="#501d83"
          />
          <path
            id="패스_9426"
            data-name="패스 9426"
            d="M100.444,31.57l-.736-.18c-.708-.157-1.319-.422-1.313-1.012.005-.54.486-.933,1.347-.933.832,0,1.347.377,1.415,1.024h1.629c-.022-1.439-1.217-2.44-3.034-2.44-1.794,0-3.107.983-3.1,2.462,0,1.192.849,1.878,2.23,2.214l.895.214c.894.219,1.4.478,1.4,1.035,0,.607-.578,1.023-1.471,1.023s-1.562-.415-1.62-1.236H96.436c.052,1.748,1.313,2.658,3.294,2.653,2,.005,3.164-.95,3.17-2.439-.005-1.355-1.053-2.063-2.456-2.383"
            transform="translate(-52.046 -10.394)"
            fill="#501d83"
          />
          <rect id="사각형_2300" data-name="사각형 2300" width="1.699" height="8.139" transform="translate(52.088 17.748)" fill="#501d83" />
          <path
            id="패스_9427"
            data-name="패스 9427"
            d="M118.216,28.133l-1.88,3.508h-.079l-1.89-3.508h-8.573v1.393h2.513v6.746h1.687V29.526h2.513v-1.3l2.935,5.144v2.9h1.7v-2.9l2.988-5.239Z"
            transform="translate(-51.129 -10.385)"
            fill="#501d83"
          />
        </g>
      </g>
    </svg>
  );
}
