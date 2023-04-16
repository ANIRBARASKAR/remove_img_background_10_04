import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import * as ml5 from "ml5";
export default function RemoveBackground() {
  const [inputRange, setinputRange] = useState(0.5);
  const [msg, setmsg] = useState("");
  const [file, setfile] = useState("");

  const [naskData, setnaskData] = useState("");

  const canvas = new fabric.Canvas("canvas");
  const images = [
    file,
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1681066471027-792a948eeb15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3NHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
  ];

  var img = images[0];

  // add img to canvas

  fabric.Image.fromURL(
    img,
    function (oImg) {
     
      removeBackground(oImg);
      canvas.add(oImg);
      if (oImg.width > canvas.width) {
        oImg.scaleToWidth(canvas.width);
      } else {
        oImg.scaleToHeight(canvas.height);
      }
     
    },

    { crossOrigin: "anonymous" }
  );

  // remove Background

  async function   removeBackground   (oImg)  {
    const uNet = await ml5.uNet("face");

    uNet.segment(oImg._originalElement, (err, result) => {
      if (err) {
        console.log("err",err);
        return;
      }
      var r = raw2img(result.raw.backgroundMask, 128, 128);


      fabric.Image.fromURL(r.toDataURL(), function (mask) {
        console.log("mask starting", mask);
        var blur = new fabric.Image.filters.Blur({ blur: 0.3 });
      
        if (inputRange) {
          blur.blur = inputRange;
          mask.setSrc(r.toDataURL(), () => {
            mask.applyFilters();
            setnaskData(mask.toDataURL());
            mask.setSrc(mask.toDataURL(), () => {
              console.log(mask.toDataURL(), "mask.toDataURL()");
              oImg.applyFilters();
              oImg.canvas.requestRenderAll();
            });
          });
          // };
        }
        mask.applyFilters();
        mask.setSrc(mask.toDataURL(), () => {
          var f = new fabric.Image.filters.BlendImage({
            image: mask,
            mode: "mask",
          });
          //call this to avoid some out of synch issues
          //with fabricjs texture binding to GL context
          canvas.requestRenderAll();

          oImg.filters.push(f);
          oImg.applyFilters();
          canvas.requestRenderAll();
        });
      });
    });
  }

  // raw2img first
  function raw2img(raw, w, h) {
    var c = new fabric.Canvas("canvas2");
    c.width = w;
    c.height = h;  
    var ctx = c.getContext("2d");
    var imgData = new ImageData(w, h);
    imgData.data.set(raw);
    ctx.putImageData(imgData, 40, 20, 0, 0, 128, 128);
    return c;
  }

 

  return (
    <div>
      RemoveBackground
      <strong>{msg}</strong>
      <input
        type="range"
        min={0}
        max={1}
        value={inputRange}
        onChange={(e) => setinputRange(e.target.value)}
      />
      <br />
      <strong>{inputRange}</strong>
      <br />
      <div className="d-flex ">
        <input
          type="file"
          onChange={(e) => setfile(URL.createObjectURL(e.target.files[0]))}
        />
        <div className="mx-5">
          <canvas
            id="canvas"
            height={200}
            width={200}
            style={{ border: "10px solid red" }}
          ></canvas>
        </div>
        <div className="mx-5">
          <canvas
            id="canvas2"
            height={200}
            width={200}
            style={{ border: "10px solid pink" }}
          ></canvas>
        </div>
      </div>
      Orignal Img : <img src={file} alt="IMG" height={200} />
    </div>
  );
}
