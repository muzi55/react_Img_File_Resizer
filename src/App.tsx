import React, { useCallback, useState } from "react";

import Resizer from "react-image-file-resizer";

function App() {
  const [url, setUrl] = useState<string>();
  const [prevImg, setPrevImg] = useState(0);
  const [nextImg, setNextImg] = useState(0);
  const [quality, setQuality] = useState(50);

  const increseQuality = useCallback(() => {
    if (quality >= 100) return;
    setQuality((prev) => prev + 5);
  }, [quality]);
  const decreseQuality = useCallback(() => {
    if (quality <= 0) return;
    setQuality((prev) => prev - 5);
  }, [quality]);

  const resizeFile = (file: File) =>
    new Promise<Blob>((resolve) => {
      Resizer.imageFileResizer(
        file,
        300, // 최댓값
        300, // 최솟값
        "JPEG",
        50,
        0,
        (uri) => {
          resolve(uri as Blob);
        },
        "blob"
      );
    });

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.files === null) return;
      const file = event.target.files[0];
      console.log(file);
      setPrevImg(file.size);

      const image = await resizeFile(file);
      const imageUrl = window.URL.createObjectURL(image);
      setUrl(imageUrl);
      setNextImg(image.size);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <h1>react Resizer 로 파일 용량, 이미지 줄이기</h1>
      <input type="file" onChange={onChange} />
      <div>
        <h2>미리보기 이미지</h2>
        {url && <img width={350} height={350} src={url} alt="미리보기 이미지" />}
      </div>
      <p>원본 이미지 사이즈 : {prevImg}</p>
      <p>압축된 이미지 사이즈 : {nextImg}</p>

      {/* quality */}
      <div>
        <h2>Quality control</h2>
        <button onClick={increseQuality}>+</button>
        <button onClick={decreseQuality}>-</button>
        <div>
          <progress value={quality} max="100" /> <span>{quality}</span>
        </div>
      </div>
    </>
  );
}

export default App;
