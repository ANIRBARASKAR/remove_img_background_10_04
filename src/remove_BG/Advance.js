import React, { useState, useRef } from "react";
import ml5 from "ml5";
import { fabric } from "fabric";

const Advance = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [base64IMG, setbase64IMG] = useState('')
  const inputRef = useRef(null);
// console.log("inputRef",inputRef);
  const handleFileUpload = (event) => {
    
    
      setImageUrl(URL.createObjectURL(event.target.files[0])); 
      
    };
    console.log("ImageUrl",imageUrl);

  const removeBackground = async () => {
    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = "anonymous";

    img.onload =async () => {
      const canvas = new fabric.Canvas("canvas");
      const image = new fabric.Image(img, {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
      });
      canvas.add(image);
      canvas.setBackgroundImage(backgroundImageUrl, canvas.renderAll.bind(canvas));

      setbase64IMG(canvas.toDataURL())
      console.log("base64IMG",base64IMG);
      console.log("image",image);
// 

      const uNet = await ml5.uNet("face");  

    uNet.segment(image._originalElement, (err, result) => {
      console.log("result",result);
      if (err) {
        console.log("err",err);
        return;
      }

      var r = raw2img(result.raw.backgroundMask, 128, 128);
      //   const mask = result.backgroundMask;  
      //   canvas.remove(image);
      //   const filtered = new fabric.Image.filters.Mask({
      //     mask: mask,
      //   });
      //   image.filters.push(filtered);
      //   image.applyFilters();
      //   canvas.add(image);
      });
    };
  };

  function raw2img(raw,w,h) {
    // *********** 1
    console.log("raw from raw2img",raw);
    var c = new fabric.Canvas("canvas2");
    c.width = w;
    c.height = h;  
    var ctx = c.getContext("2d");
    var imgData = new ImageData(w, h);
    console.log("imgData from raw2Img",imgData);
    imgData.data.set(raw);
    ctx.putImageData(imgData, 40, 20, 0, 0, c.width, c.height);
    return c;


    // **************** 2
    // const img = new Image();
    // img.src = raw;
    // img.crossOrigin = "anonymous";

    // img.onload =async () => {
    //   const canvas2 = new fabric.Canvas("canvas2");
    //   const image = new fabric.Image(img, {
    //     scaleX: canvas2.width / img.width,
    //     scaleY: canvas2.height / img.height,
    //   });
    //   canvas2.add(image);
    //   canvas2.setBackgroundImage(backgroundImageUrl, canvas2.renderAll.bind(canvas2));
    // }
  }
  
  
// console.log("base64IMG",base64IMG);
  return (
    <div>
      <input type="file" accept="image/*" ref={inputRef} onChange={handleFileUpload} />
      <button onClick={removeBackground}>Remove Background</button>
      <canvas id="canvas" width="600" height="400" style={{border:"8px dashed green"}}></canvas>
      <canvas id="canvas2" width="600" height="400" style={{border:"8px dashed blue"}}></canvas>
      <img src={imageUrl} alt="IMG" height={200} />
    </div>
  );
};

export default Advance;  