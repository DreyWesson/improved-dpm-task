import React, { useEffect, useState } from "react";
import "./App.css";
import useRecorder from "./hooks/useRecorder";
import { useForm } from "./hooks/useForm";
import { validations } from "./utils/validations";
import * as api from "./api/index";

const App = () => {
  const [audioError, setAudioError] = useState();

  const [
    audioURL,
    audioData,
    isRecording,
    startRecording,
    stopRecording,
  ] = useRecorder();

  const { handleBlur, handleChange, data, errors } = useForm({
    validations,
  });

  useEffect(() => {
    !audioURL
      ? setAudioError({
          audio: "Record an audio",
        })
      : setAudioError({ audio: "" });
  }, [audioURL]);

  const handleSubmit = async () => {
    const validate = Boolean(
      errors && Object.keys(errors).length === 0 && audioData
    );

    if (validate) {
      // const formData = new FormData();
      // formData.append("audio-file", data);
      const result = { audioData, data };
      const postAudio1 = await api.postAudio(result);
      console.log(postAudio1);
    } else handleBlur();
  };

  return (
    <div className="microphone__wrapper">
      <audio src={audioURL} controls onChange={handleChange("audio")} />
      {audioError && <p className="">{audioError.audio}</p>}
      <div className="">
        <div style={{ margin: "0px", width: "100%" }}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className={"microphone__label"}>
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              className="microphone__input"
              onBlur={handleBlur}
              onChange={handleChange("email")}
              value={data.email || ""}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </form>
        </div>
        {isRecording ? (
          <button className="btn btn__stop" onClick={stopRecording}>
            Stop Recording
          </button>
        ) : (
          <button
            className="btn btn__start"
            onClick={startRecording}
            disabled={isRecording}
          >
            Start Recording
          </button>
        )}

        <button className={`btn btn__submit`} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};
export default App;
