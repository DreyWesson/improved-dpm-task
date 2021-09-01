import React, { useState } from "react";
import "./App.css";
import useRecorder from "./hooks/useRecorder";
import { useForm } from "./hooks/useForm";
import { validations } from "./utils/validations";
import * as api from "./api/index";

const App = () => {
  const [audioStatus, setAudioStatus] = useState("Record an Audio");

  const [
    audioURL,
    audioData,
    isRecording,
    startRecording,
    stopRecording,
  ] = useRecorder();

  const {
    handleBlur,
    handleChange,
    inputValues,
    setInputValues,
    errors,
    // audioStatus,
    // handleSubmit,
  } = useForm({
    validations,
  });

  const handleSubmit = async (e) => {
    const validate = Boolean(
      errors && Object.keys(errors).length === 0 && audioData
    );

    if (!audioData) setAudioStatus("Oops, record an audio.");
    if (validate) {
      const result = { audioData, inputValues };
      // const formData = new FormData();
      // formData.append("audio-data", result);
      const postAudio1 = await api.postAudio(result);
      setInputValues({});
      console.log(postAudio1);
    } else handleBlur();
  };

  return (
    <div className="microphone__wrapper">
      <audio src={audioURL} controls onChange={handleChange("audio")} />
      {/* Call to action */}
      {audioStatus && <p className="">{audioStatus}</p>}
      <div className="">
        <div style={{ margin: "0px", width: "100%" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e, audioData);
            }}
          >
            <label
              data-testid="input_label"
              htmlFor="email"
              className={"microphone__label"}
            >
              Email
            </label>
            <input
              name="email"
              data-testid="input"
              type="email"
              placeholder="Enter Email"
              className="microphone__input"
              onBlur={handleBlur}
              onChange={handleChange("email")}
              value={inputValues.email || ""}
            />
            {/* Helper text */}
            {errors.email && <p className="error">{errors.email}</p>}
          </form>
        </div>
        <button
          data-testid="start_recording"
          className={`btn ${isRecording ? "btn__stop" : "btn__start"}`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>

        <button
          data-testid="btn"
          className={`btn btn__submit`}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
export default App;
