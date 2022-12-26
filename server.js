const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

const app = express();
const port = 8080;

const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.post("/convert", upload.single("file"), (req, res) => {
  const file = req.file; // The uploaded file object
  res.setHeader("Content-Type", "text/html");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // res.setHeader('Access-Control-Allow-Credentials', true);
  ffmpeg(file.path)
    .outputOptions([
      "-vf",
      "fps=25", // Set the frame rate to 25 fps
      "-c:v",
      "libx264", // Use the H.264 codec for the video
      "-crf",
      "18", // Set the video quality to 18 (lower value means higher quality)
      "-c:a",
      "aac", // Use the AAC codec for the audio
      "-movflags",
      "+faststart", // Allow the mp4 file to start playing faster
    ])
    .output("output.mp4")
    .on("error", (err) => {
      console.error(err);
      res.send("Error al convertir el archivo");
    })
    .on("end", () => {
      res.download("output.mp4", "tactics-joshu.mp4", (err) => {
        if (err) {
          console.error(err);
          res.send("Error al descargar el archivo convertido");
        } else {
          // Borra el archivo de la carpeta uploads
          fs.unlink(file.path, (error) => {
            if (error) {
              console.error(error);
            }
            console.log("Archivo borrado")
          });
        }
      });
    })
    .run();
});

app.listen(port, () => {
  console.log(`Server listening at port:${port}`);
});
