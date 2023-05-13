import { Router } from "express";
import mongoose from "mongoose";
import Faculty from "../models/faculty.js";
import Foapa from "../models/foapa.js";
import {
  encryptPassword,
  decryptPassword,
} from "../utils/authenticatePassword.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyToken } from "../middleware/auth.js";
dotenv.config();

const router = Router();

// Registering user - POST /api/register
router.post("/register", async (req, res) => {
  const {
    employmentNumber,
    firstName,
    lastName,
    workEmail,
    phoneNumber,
    password,
    mailingAddress,
    department,
    zipCode,
    city,
    state,
    country,
    userFoapas,
  } = req.body;

  //Formatting the user's foapa information
  let foapaDetails = [];
  userFoapas.forEach((userFoapa) => {
    let concatFoapa =
      userFoapa.fNumber +
      "-" +
      userFoapa.oNumber +
      "-" +
      userFoapa.aNumber +
      "-" +
      userFoapa.pNumber +
      "-" +
      userFoapa.a2Number;

    foapaDetails.push({
      foapaName: userFoapa.foapaName,
      foapaNumber: concatFoapa,
    });
  });

  try {
    let encryptedPassword = await encryptPassword(password);

    const faculty = new Faculty({
      employmentNumber,
      firstName,
      lastName,
      workEmail: workEmail.toLowerCase(),
      phoneNumber,
      password: encryptedPassword,
      mailingAddress,
      department,
      zipCode,
      city,
      state,
      country,
      foapaDetails,
    });

    let existingUser = await Faculty.findOne({ employmentNumber });

    if (existingUser) {
      console.log("User already exists");
      res.status(409).send({ message: "User already exists" });
    } else {
      await faculty.save();

      //Creates a token thatll be used to authenticate the user for later api calls
      let token = await jwt.sign({ employmentNumber }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.status(200).send({ message: "Registration successful!", token });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
    console.error(error.message);
  }
});

router.post("/login", async (req, res) => {
  const { workEmail, password } = req.body;
  try {
    let facultyInfo = await Faculty.findOne({
      workEmail: workEmail.toLowerCase(),
    }).select("workEmail password employmentNumber");

    if (facultyInfo === null) {
      res.status(404).send({
        message: "Credentials not found. Please check your email and password",
      });
    } else {
      let passwordMatches = await decryptPassword(
        password,
        facultyInfo.password
      );
      if (passwordMatches) {
        let token = await jwt.sign(
          { employmentNumber: facultyInfo.employmentNumber },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        );

        console.log("token", token);
        res.status(200).send({ message: "Login successful", token });
      } else {
        res.status(403).send({ message: "Password does not match" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
});

// Retrieve user information - GET /api/retrieveUserInformationSummary
router.get("/retrieveUserInformationSummary", verifyToken, async (req, res) => {
  try {
    let facultyInfo = await Faculty.findOne(
      {
        employmentNumber: req.user.employmentNumber,
      },
      {
        // All to stop the _id from showing, might remove/refactor later ;-;
        _id: 0,
        city: 0,
        foapaDetails: 0,
        mailingAddress: 0,
        password: 0,
        state: 0,
        zipCode: 0,
        country: 0,
        department: 0,
      }
    );
    if (facultyInfo === null) {
      res.status(404).send({
        message: "Unable to retrieve account information",
      });
    } else {
      res.status(200).send(facultyInfo);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
});

router.get("/retrieveAccountInformation", verifyToken, async (req, res) => {
  try {
    let facultyInfo = await Faculty.findOne({
      employmentNumber: req.user.employmentNumber,
    });

    if (facultyInfo === null) {
      res.status(404).send({
        message: "Unable to retrieve faculty information.",
      });
    } else {
      console.log(facultyInfo);
      res.status(200).send(facultyInfo);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
});

router.post("/updateAccountInfo", async (req, res) => {
  console.log("updatig body", req.body);
  const {
    firstName,
    lastName,
    workEmail,
    phoneNumber,
    password,
    mailingAddress,
    department,
    zipCode,
    city,
    state,
    country,
  } = req.body;

  try {
    let facultyInfo = await Faculty.updateOne({
      firstName,
      lastName,
      workEmail,
      phoneNumber,
      mailingAddress,
      department,
      zipCode,
      city,
      state,
      country,
    });

    if (facultyInfo === null) {
      res.status(404).send({
        message: "Unable to modify account information.",
      });
    } else {
      console.log("updated faculty");
      res.status(200).send({ message: "Account updated successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
});
export default router;
