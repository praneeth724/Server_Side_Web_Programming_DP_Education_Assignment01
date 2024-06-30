const express = require("express");
const app = express();
const db = require("./database.js");
const cron = require("node-cron");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());

const port = 8080;

app.post("/api/customers", (req, res) => {
  try {
    const {
      name,
      address,
      email,
      dateOfBirth,
      gender,
      age,
      cardHolderName,
      cardNumber,
      expiryDate,
      cvv,
      timestamp,
    } = req.body;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Credit card number validation
    const cardNumberRegex = /^\d{12}$/;
    if (!cardNumberRegex.test(cardNumber)) {
      return res.status(400).json({ error: "Invalid credit card number" });
    }

    //Insert
    db.run(
      `INSERT INTO customers (name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timestamp)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        address,
        email,
        dateOfBirth,
        gender,
        age,
        cardHolderName,
        cardNumber,
        expiryDate,
        cvv,
        timestamp,
      ],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Failed to register customer" });
        }
        res.status(201).json({
          message: `Customer ${name} has been registered`,
          customerId: this.lastID,
        });
      }
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", port));
});
