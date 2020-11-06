const router = require("express").Router();
const send = require("send");
const fs = require("fs");

const verifyToken = require("../middlewares/verifyToken.js");

const ExportJobQueue = {};

router.post("/", verifyToken, (req, res) => {
  try {
    const user = req.body.username;
    const filename = req.body.filename;
    console.log(`Processing request of ${user} for ${filename}`);
    const filepath = "./Uploads/" + filename;
    console.log(`serving ${filepath}`);
    if (fs.existsSync(filepath)) {
      let dataStream = fs.createReadStream(filepath);
      ExportJobQueue[user] = dataStream;
      send(req, filepath)
        .on("abort", () => {
          res.status(200).end("Your export has been aborted. Successfully");
          res.destroy();
          delete ExportJobQueue[user];
        })
        .on("end", () => {
          res.status(200).json(`Export Process finished successfully`);
          delete ExportJobQueue[user];
        })
        .pipe(res);
    } else {
      throw new Error(`The requested file doesn't exist`);
    }
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post("/stop", verifyToken, (req, res) => {
  const user = req.body.username;
  if (user in ExportJobQueue) {
    ExportJobQueue[user].emit("abort");
    console.log(`Export request by ${user} has been aborted successfully`);
    res.status(200).json(`You have successfully aborted your export task.`);
  } else res.status(404).json(`No export Job is found for ${user}`);
});

router.get("/peek", verifyToken, (req, res) => {
  try {
    const fileList = [];
    fs.readdir("./Uploads", (err, files) => {
      files.forEach((file) => {
        console.log(file);
        fileList.push(String(file));
      });
      if (fileList.length) return res.status(200).json({ files: fileList });
      else return res.status(404).json("No files are uploaded");
    });
  } catch (e) {
    return res.status(500).json("Server Error: Failed Fetching Files");
  }
});

module.exports = router;
