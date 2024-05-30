"use client";

import Uploader from "@/components/Uploader";
import { useRef } from "react";

const Visualiser = () => {
  const contextRef = useRef<HTMLCanvasElement>(null);

  const visualize = (audioBuffer: AudioBuffer, audioContext: AudioContext) => {
    const canvas = contextRef.current;

    if (!canvas) return;
    canvas.width = canvas.clientWidth;
    canvas.height = 400;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128; // must be a power of 2 and must lie between 32 and 16384; default values  2048

    const frequencyBufferLength = analyser.frequencyBinCount;
    const frequencyData = new Uint8Array(frequencyBufferLength); // half of fftSize;

    // // connect source and analyser.
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    source.start();

    const canvasContext = canvas.getContext("2d")!;
    //   const center = canvas.height / 2;
    const barWidth = canvas.width / frequencyBufferLength;

    // requestAnimationFrame will call this function, only before the next repaint.

    const draw = () => {
      requestAnimationFrame(draw);

      //   canvasContext.clearRect(0, 0, canvas.width, canvas.height);

      canvasContext.fillStyle = "#f4c2c2";
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);

      analyser.getByteFrequencyData(frequencyData); // get realtime data;

      // const channelData = audioBuffer?.getChannelData(0); // return Pulse Code Modulation,   that used to digitally represent analog data. PCM : analog to digital conversion.
      // const numberOfChunks = 400;
      // const chunkSize = Math.ceil(channelData.length / numberOfChunks);

      for (let i = 0; i < frequencyBufferLength; i++) {
        canvasContext.fillStyle = `rgba(82,113, 255, ${frequencyData[i] / 255}`;

        //   const chunk = channelData.slice(i * chunkSize, (i + 1) * chunkSize);
        //   const min = Math.min(...chunk) * 100;
        //   const max = Math.max(...chunk) * 100;
        // This is a static bar graph but we need to make it move and show in sync with music;
        // ... Fast Fourier Transform, is mathematical algorithm that convert a complex signal like a piece of music from its original time-based format into a frrequency-based format
        canvasContext.fillRect(
          i * barWidth,
          canvas.height - frequencyData[i],
          barWidth - 1,
          frequencyData[i]
        );
      }
    };

    draw();
  };

  return (
    <>
      <Uploader visualize={visualize} />
      <canvas
        id="canvas"
        ref={contextRef}
        style={{
          marginBlock: 10,
          width: "100%",
          display: "block",
        }}
      ></canvas>
    </>
  );
};

export default Visualiser;
