"use client";
import { ChangeEvent, useEffect, useRef } from "react";

type UploaderProps = {
  visualize: (audioBuffer: AudioBuffer, audioContext: AudioContext) => void;
};

const Index = ({ visualize }: UploaderProps) => {
  // const [file, setFile] = useState<any>();
  const audioRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file: any = event.target?.files?.[0];
    // setFile(file);

    if (Boolean(file)) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const arrayBuffer: ArrayBuffer = event.target!.result! as ArrayBuffer;

        const audioContext = new AudioContext();

        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          /* Info: 
             Channels: Independent audio signals contain within an audio buffer. Each channel represents, a separate stream of audio data, example mono -> single , sterio => two channel, surround sound -> multiple channel 
             SampleRate : number of sample of audio carried per sec,  measured in hertz, determines quality of audio.   
          */

          visualize(audioBuffer, audioContext);
        });
      };

      reader.readAsArrayBuffer(file);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    audio?.addEventListener("change", handleChange as any);

    return () => {
      audio?.removeEventListener("change", handleChange as any);
    };
  }, [audioRef, handleChange]);

  return (
    <>
      <input id="audio" type="file" accept="audio/*" ref={audioRef} />
    </>
  );
};

export default Index;
