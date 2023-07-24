const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const axios = require("axios");
const LocalStorage = require("node-localstorage").LocalStorage;
const { check, validationResult } = require("express-validator");
const config = require("../config/config");
var localStorage = new LocalStorage("./scratch");
const auth = require("../middleware/auth");
const UserModel = require("../models/User.model");
const jwt = require("jsonwebtoken");
const cacheController = require("../controllers/cache.controller");

router.get("/", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const access_token = jwt.sign(
      { client_id: "everestclientId" },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 360000,
      }
    );
    res.send({ access_token: access_token, expires_in: 3600 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.route('/member').get(async (req, res) => {
  try {
    const targetId  = req.query.param
    const contact_user = await cacheController.getThroughCacheWithoutHydraMember(
      `${config.config.base_url_resamania}${targetId}`,
      'contact_user'
    );
    var monobjet_json = JSON.stringify(contact_user);
    localStorage.setItem('MemberData', monobjet_json);
    const id = (await contact_user.contactId.split('/').pop());
    const contact = await cacheController.getThroughCacheWithoutHydraMember(
      `${config.config.base_url_resamania}/everestsportclubbesancon/contacts/${id}`,
      'contact_resamania'
    );
    res.send({ contact, contact_user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});


router.post("/login-superAdmin",
  [
    check("email", "Veuillez saisir un email valide").isEmail(),
    check("password", "Mot de passe requis").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await UserModel.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Credentials invalides" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Credentials invalides" }] });
      }

      if (user.roles.includes("ROLE_SUPERADMINISTRATION")) {
        const payload = {
          user: {
            id: user.id,
            name: user.name,
            roles: user.roles,
          },
        };
        jwt.sign(
          payload,
          "everestsecrettoken",
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } else {
        return res.status(403).json({ error: "Unauthorized" });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);


router.post("/everest-admin", async (req, res) => {
  try {
    const {name, email, password, roles } = req.body;

    // Check if the email already exists in the database
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
     const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      roles: roles || [],
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


router.get("/everest-admin/all", async (req, res) => {
  try {
    // Find all admin users in the database
    const adminUsers = await UserModel.find({ roles: "ROLE_ADMINISTRATION" });

    res.status(200).json(adminUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// Update admin
router.put("/everest-admin/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find the admin by ID
    const admin = await UserModel.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update the admin data
    admin.name = name;
    admin.email = email;

    // Check if a new password is provided and update it
    if (password) {
      admin.password = hashedPassword;
    }

    // Save the updated admin
    await admin.save();

    res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


router.delete("/everest-admin/:adminId", async (req, res) => {
  try {
    const adminId = req.params.adminId;

    // Check if the admin user exists
    const existingAdmin = await UserModel.findById(adminId);
    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    // Delete the admin user
    await existingAdmin.remove();

    res.status(200).json({ message: "Admin user deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});





router.get("/admin", auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/member",
  [
    check("email", "Veuillez entrer une adresse email valide!").isEmail(),
    check("password", "Veuillez entrer votre mot de passe!").not().isEmpty(),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const credential = await cacheController.credentialthroughCache();
      const token = await axios.get(
        config.config.base_url_resamania + "/" +
          config.config.client_token +
          "/oauth/v2/token?client_id=" +
          process.env.CLIENTID +
          "&client_secret=" +
          process.env.CLIENTSECRET +
          "&grant_type=password" +
          "&username=" +
          email +
          "&password=" +
          password,
        credential
      );
      localStorage.setItem("member", token.data.access_token);
      res.send(token.data.access_token);
    } catch (err) {
      console.error(err.message);
      if (err.response) {
        res.status(err.response.status).json({
          errors: [
            err.response.data,
            {
              msg: err.response.data.error_description,
              param: "email",
            },
            {
              msg: err.response.data.error_description,
              param: "password",
            },
          ],
        });
      }
      res.status(500).send("server error");
    }
  }
);

router.post(
  "/admin",
  [
    check("email", "Veuillez entrer une adresse email valide!").isEmail(),
    check("password", "Veuillez entrer votre mot de passe!").not().isEmpty(),
  ],
  async (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const token = await axios.get(
        config.config.base_url_resamania + "/" +
          config.config.client_token +
          "/oauth/v2/token?client_id=" +
          process.env.ACCESSID +
          "&client_secret=" +
          process.env.ACCESSSECRET +
          "&grant_type=client_credentials"
      );
      localStorage.setItem("admin", token.data.access_token);
      res.send(token.data);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);
router.get("/everest-user", auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.post(
  "/everest-user",
  [
    check("email", "Veuiller saisir un email valide").isEmail(),
    check("password", "Mot de passe requis").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await UserModel.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Credentials invalides" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Credentials invalides" }] });
      }
      const payload = {
        user: {
          id: user.id,
          name: user.name,
          roles: user.roles,
        },
      };
      jwt.sign(
        payload,
        "everestsecrettoken",
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
router.route("/").delete(async (req, res) => {
  try {
    localStorage.removeItem("member");
    localStorage.removeItem("MemberData");
    cacheController.jsonCache.del("subscriptions_key");
    cacheController.jsonCache.del("contact_user");
    cacheController.jsonCache.del("contact_resamania");
    const keys = await cacheController.redis.keys("*memberOwnEvent*");
    keys.length > 0 ? await cacheController.redis.del(keys) : console.log("");
    res.send("token deleted");
  } catch (err) {
    if (err.response.data) {
      res.status(err.response.data.code).json({
        errors: [err.response.data],
      });
    }
    console.error(err.message);
    res.status(500).send("server error");
  }
});
module.exports = router;