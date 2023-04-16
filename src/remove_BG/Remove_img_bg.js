import React,{useState} from 'react'
import { fabric } from 'fabric';
import * as ml5 from "ml5";
export default function Remove_img_bg() {

  const [inputRange, setinputRange] = useState(20)
  const canvas = new fabric.Canvas("canvas");    
// canvas.backgroundColor = "blue ";
const images =    
  [
           
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1681066471027-792a948eeb15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3NHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
  
  
  ];

var img = images[0];
  
// add img to canvas

fabric.Image.fromURL(
  img,
  function (oImg) {
    // debugger;
    removeBackground(oImg);  
    // LOG("image loaded");
    canvas.add(oImg);
    if (oImg.widh > canvas.width) {
      oImg.scaleToWidth(canvas.width);
    } else {
      oImg.scaleToHeight(canvas.height);
    }
    // LOG("removing background");
    console.log("oImg",oImg._originalElement);  
  },
  { crossOrigin: "anonymous" }  
);


// remove Background

function removeBackground(oImg) {
  // LOG("removing background: loading UNET face model");
  const uNet = ml5.uNet("face");
  console.log("uNet",uNet);

  // LOG("removing background: UNET image segmentation");
  uNet.segment(oImg._originalElement, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
  
    var r = raw2img(result.raw.backgroundMask, 128, 128);

    console.log("r",r);    
    // var r =""           
    // console.log(r.toDataURL());
  
    // LOG("removing background: loading image mask");
    fabric.Image.fromURL(r.toDataURL(), function (mask) {
      console.log("mask",mask);
      var blur = new fabric.Image.filters.Blur({ blur: 0.3 });
      console.log("r.toDataURL()",r.toDataURL());
      // var blurControl = false
      // var blurControl = document.querySelector(".blur");
      if (inputRange) {
        // blurControl.onchange = blurControl.oninput = function () {
          console.log("this.value",inputRange);
          blur.blur = inputRange
          mask.setSrc(r.toDataURL(), () => {
            mask.applyFilters();  
            mask.setSrc(mask.toDataURL(), () => {
              oImg.applyFilters();
              oImg.canvas.requestRenderAll();
            });
          });
        // };  
      }
      // mask.filters.push(blur);
      mask.applyFilters();   
      mask.setSrc(mask.toDataURL(), () => {
        // LOG("removing background: applying image mask");
        var f = new fabric.Image.filters.BlendImage({
          image: mask,
          mode: "mask"
        });
        //call this to avoid some out of synch issues
        //with fabricjs texture binding to GL context
        canvas.requestRenderAll();

        oImg.filters.push(f);
        oImg.applyFilters();
        canvas.requestRenderAll();
        // LOG("removing background: DONE");
      });   
    });  
  });  
}
     

// // raw2img first 
// function raw2img(raw, w, h) {

//   console.log("raw",raw);
// var c = new fabric.Canvas("canvas2");
// console.log("***** c",c);
// c.width = w;
// c.height = h;
// var ctx = c.getContext("2d");
// var imgData = new ImageData(w, h);
// imgData.data.set(raw);
// ctx.putImageData(imgData, 0, 0, 0, 0, w, h);
// return c;
// }

// by Anir 

function raw2img(raw, w, h) {

  console.log("raw",raw);
var c = new fabric.Canvas("canvas2");
console.log("***** c",c);
c.width = w;
c.height = h;
var ctx = c.getContext("2d");
var imgData = new ImageData(w, h);
console.log("imgData",imgData);
imgData.data.set(raw);
ctx.putImageData(imgData, 0, 0, 0, 0, w, h);

return c;
}   




  return (
    <div>RemoveBackground
      
<input type="range"  onChange={ e => setinputRange(e.target.value)}/> 
      <br />
      <h1>{inputRange}</h1>
    
    <div className="message"> Hello : </div>   
    <div className="originalWrap">
    <img src="" className="original"/> 
    </div>
    
    <canvas id='canvas' height={500} width={500} style={{border:"10px solid red"}}></canvas>
    <canvas id='canvas2' height={500} width={500} style={{border:"10px solid green"}}></canvas>
    
    Orignal Img : <img src={img} alt="IMG" height={200} />
    </div>
  )  
}
