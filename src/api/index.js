const baseURL = "http://localhost:5000/api";

// Posts APIs
const postAudio = async (result) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: result,
  };

  const postAudio = await fetch(`${baseURL}/posts`, requestOptions);
  console.log(postAudio);
};

export { postAudio };
