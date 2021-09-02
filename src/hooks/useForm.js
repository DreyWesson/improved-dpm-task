import { useState } from "react";
import * as api from "../api/index";
export const useForm = ({ validations }) => {
  const [inputValues, setInputValues] = useState({});
  const [errors, setErrors] = useState({});
  const [audioStatus, setAudioStatus] = useState("Record an Audio");

  const handleChange = (key, sanitizeFn) => (e) => {
    // sanitize input value if necessary
    const value = sanitizeFn ? sanitizeFn(e.target.value) : e.target.value;
    // set values of input field
    setInputValues({
      ...inputValues,
      [key]: value,
    });
  };

  const handleBlur = async (valid = true, newErrors = {}) => {
    if (validations) {
      for (const key in validations) {
        // get input value where $key is the input field name
        const value = inputValues[key];
        // get all the validation criteria for input field
        const { required, pattern, custom } = validations[key];
        valid = false;

        // if input value is empty
        if (required?.value && !value) newErrors[key] = required?.message;

        // if input doesn't match our pattern
        if (pattern?.value && !RegExp(pattern.value).test(value))
          newErrors[key] = pattern.message;

        // if our input has not met our specification
        if (custom?.isValid && !custom.isValid(value))
          newErrors[key] = custom.message;
      }
      // if any of d validation rules failed
      if (!valid) return setErrors(newErrors);
    }
    setErrors({});
  };

  const handleSubmit = async (e, audioData) => {
    e.preventDefault();
    console.log(audioData);
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

  return {
    inputValues,
    setInputValues,
    handleBlur,
    handleChange,
    errors,
    handleSubmit,
    audioStatus,
  };
};
