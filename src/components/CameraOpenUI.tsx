import React, { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import UploadImageUI from "./UploadImageUI";
import DriverLicenseInfo from "./DriverLicenseInfo";

const CameraOpenUI: React.FC = () => {
  const [licenseText, setLicenseText] = useState<any>({
    dl: "",
    address: "",
    name: "",
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWebcamOn, setIsWebcamOn] = useState<boolean>(false);

  const isMobile = () => {
    const userAgent = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
  };

  const deviceType = isMobile() ? "mobile" : "desktop";

  const handleToggleWebcam = () => {
    setIsWebcamOn((prevState) => !prevState);
  };

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };
    initCamera();
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas!.getContext("2d");

    if (video && canvas && context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (blob) {
          const { data } = await Tesseract.recognize(blob, "eng", {
            logger: (m) => console.log(m),
          });

          setLicenseText(data.text);
        }
      }, "image/jpeg");
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const { data } = await Tesseract.recognize(file, "eng", {
        // logger: (m) => console.log(m),
      });

      if (data) {
        // @ts-ignore
        let name = data.text.match(/(?<=FN\s)(.*?)(?=\+)/)[0]
          ? // @ts-ignore
            data.text.match(/(?<=FN\s)(.*?)(?=\+)/)[0]
          : "Name not found";
        // @ts-ignore
        let dlNumber = data?.text?.match(/\d{7,}/)[0] || "DL number not found";
        let addressMatch = data.text.match(
          /\d+ [A-Z]+\s[A-Z]+\s[A-Z]+,\s[A-Z]+\s\d{5}/
        );

        console.log({ addressMatch });
        let address = addressMatch ? addressMatch[0] : "Address not found";

        setLicenseText({ dl: dlNumber, address, name: "" });
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Driver's License Reader</h1>

      {isWebcamOn && (
        <div
          className={`${
            deviceType === "mobile" ? "hidden" : "flex"
          } justify-center items-center mb-4`}
        >
          <video
            ref={videoRef}
            width="500"
            height="500"
            autoPlay
            className="border"
          ></video>
        </div>
      )}
      <div
        className={`mb-4 ${
          deviceType === "mobile" ? "hidden" : ""
        } text-center`}
      >
        <button
          onClick={handleToggleWebcam}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isWebcamOn ? "Stop" : "Start"} Camera
        </button>
        {isWebcamOn && (
          <button
            onClick={handleCapture}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 rounded"
          >
            Capture
          </button>
        )}
      </div>
      <div>
        <canvas
          ref={canvasRef}
          width="400"
          height="300"
          style={{ display: "none" }}
        ></canvas>
      </div>

      <UploadImageUI handleImageUpload={handleImageUpload} />
      <div>
        <DriverLicenseInfo
          name={licenseText.name}
          address={licenseText.address}
          dlNumber={licenseText.dl}
        />
      </div>
    </div>
  );
};

export default CameraOpenUI;
