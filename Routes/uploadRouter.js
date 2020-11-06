const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken.js");
const formidable = require("formidable");
const fs = require("fs");

const redis = require("redis");
const client = redis.createClient({
  host: "redis-server",
  port: 6379,
});
client.on("error", function (error) {
  console.log("Failed initing Redis Client");
  console.error(error);
});

const UploadJobQueue = {};

router.post("/", verifyToken, (req, res) => {
  try {
    const user = req.body.username;
    console.log(`${user} has started Uploading a file`);
    let filename;
    const form = new formidable.IncomingForm({
      maxFileSize: Infinity,
      keepExtensions: true,
    });
    form.parse(req);

    form.on("fileBegin", (name, file) => {
      filename = file.name;
      console.log(`Starting to upload  ${filename}`);
      filepath = "./Uploads/" + file.name;
      if(user in UploadJobQueue)
        throw new Error(`${user} is already uploading a file, Please terminate the later to proceed further`);
      UploadJobQueue[user] = form;
    });

    form.on("file", (name, file) => {
      console.log(`${file.name} has been uploaded successfully.`);
      // Shift to original Location from os.tempdir()
      fs.rename(file.path, "./Uploads/" + file.name, (err) => {
        if (err) throw err;
        console.log(`${file.name} stored to Uploads`);
      });
      delete UploadJobQueue[user];
    });

    form.on("abort", () => {
      console.log(`${filepath} upload aborted`);
      res.status(200).json(`Uploading Task is successfully Stopped by ${user}`);
      res.destroy();
      delete UploadJobQueue[user];
    });

    form.on("error", (err) => {
      console.log(`Stopped uploading to ${filepath} due to server errors`);
      res.status(500).json(`Server Error, Please try to upload the file again.`);
      throw err;
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post("/stop", verifyToken, (req, res) => {
  try {
    const user = req.body.username;
    if (user in UploadJobQueue) {
      console.log(`Stopping ${user}'s upload.`);
      UploadJobQueue[user].emit("abort");
      res.status(200).json(`Upload Task has been ABORTED re-uploading is feesible now.`);
    } else {
      res.status(404).json(`No upload jobs are being run by ${user}.`);
    }
  } catch (err) {
    res.status(400).json(`Server Error: Job terminating. Try again later.`);
  }
});

module.exports = router;
