


const User = require("../models/User");
const Phone = require("../models/phone");

const multer = require("multer") // to parse form data body
const path = require("path")
const fs = require("fs")

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");


const router = require("express").Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    cb(null, 'src/uploads/')
  },
  filename: (req, file, cb) => {
    // console.log(file)
    cb(null, Date.now() + file.originalname) //
  }
})

const fileFilter = (req, file, cb) => {

  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {

    cb(new Error("file not valid you are not send img"), false);
  }
}

const upload = multer({

  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})


// const upload = multer({dest:'src/uploads/'})


router.post('/1', upload.single('image'), verifyTokenAndAuthorization, (req, res, next) => {
  const obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
      contentType: 'image/png'
    }
  }
  // console.log(obj)
  // console.log(req.file.filename)
  res.send(req.file.filename)

});

// router.get("/file/:filename", async (req, res) => {
//   try {
//       const file = await gfs.files.findOne({ filename: req.params.filename });
//       const readStream = gfs.createReadStream(file.filename);
//       readStream.pipe(res);
//   } catch (error) {
//       res.send("not found");
//   }
// });


router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.status(500).json("you have to send image");

  } else {
    const phone = new Phone({
      userID: req.body.userID,
      name: req.body.name,
      desc: req.body.desc,
      ip: req.body.ip,
      color: req.body.color,
      model: req.body.model,
      img: {
        data: 'http://localhost:5000/' + req.file.filename,
        contentType: 'image/png'
      }
    });


    try {
      const savedphone = await phone.save();

      res.status(201).json(savedphone);
    } catch (err) {
      res.status(500).json(err);
    }
  }

})

// Get All Phones
router.get("/", async (req, res) => {
  const query = req.query.new;
  try {
    const phones = query ? await Phone.find().sort({ _id: -1 }).limit(5) : await Phone.find();
    res.status(200).json(phones);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Phone By ID
router.get("/:id", async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id);
    res.status(200).json(phone._doc);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Phone By Model
router.get("/filter/:name", async (req, res) => {
  try {
    const phone = await Phone.find({name: req.params.name }).sort({ _id: -1 });
    res.status(200).json(phone);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.delete("/:id",verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Phone.findByIdAndDelete(req.params.id);

    res.status(200).json("phone has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;