const express = require("express");
const mysql = require("mysql");
const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "intern",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  } else {
    console.log("Database connected");
  }

  // console.log('Connected to MySQL as ID ' + db.threadId());
});

app.get("weather/realtime", (req, res) => {
  //fetch real-time weather data from the weather_realtime
  const location = req.query.location;
  db.query(`SELECT id FROM locations WHERE name=${location}`, (err, result) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      res.status(500).send("Error fetching users");
      return;
    }
    console.log(result);
    res.json(result);
  });
});

app.get("/weather/forecast", (req, res) => {
  //fetch a 3 day weather forecast table for specified locations
  const location = req.query.location;
  db.query(`SELECT id FROM locations WHERE name=${location}`, (err, result) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      res.status(500).send("Error fetching users");
      return;
    }
    console.log(result);
    res.json(result);
  });
});

app.get("/weather/airquality", (req, res) => {
  const location = req.query.location;
  db.query(`SELECT id FROM locations WHERE name=${location}`, (err, result) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      res.status(500).send("Error fetching users");
      return;
    }
    console.log(result);
    res.json(result);
  });
  //fetch air quality data form the air_quality  table for a specified lcoation
});

app.get("/weather/locations", (req, res) => {
  //fetch all the locations
  db.query(`SELECT * FROM locations}`, (err, result) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      res.status(500).send("Error fetching users");
      return;
    }
    console.log(result);
    res.json(result);
  });
});

app.get("/weather/generate", (req, res) => {
  const conditions = ["Sunny", "Rainy", "Cloudy", "Snowy", "Windy"];
  const descriptions = ["Good", "Moderate", "Poor", "Dangerous"];

  function generateRealTimeWeather() {
    return {
      temperature: (Math.random() * 40).toFixed(2),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: Math.floor(Math.random() * 100),
      wind_speed: (Math.random() * 15).toFixed(2),
    };
  }

  function generateRandomForecast() {
    return {
      date: new Date(Date.now()),
      min_temp: (Math.random() * 10).toFixed(2),
      max_temp: (Math.random() * 10).toFixed(2),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
    };
  }

  function generateRandomAirQuality() {
    return {
      aqi: Math.floor(Math.random() * 200),
      description:
        descriptions[Math.floor(Math.random() * descriptions.length)],
    };
  }

  let currentWeather = generateRealTimeWeather();
  let Forecast = generateRandomForecast();
  let airQuality = generateRandomAirQuality();
  let loc_id = Math.floor(Math.random() * 10);

  db.query(
    `INSERT INTO weather_realtime(location_id,temperature,condition,humidity,wind_speed) VALUES (${loc_id},${currentWeather.temperature},${currentWeather.condition},${currentWeather.humidity},${currentWeather.wind_speed})`,
    (err, result) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        res.status(400).send("Error creating user");
        return;
      }
      res.status(201).send("User created successfully");
    }
  );
  db.query(
    `INSERT INTO weather_forecast(location_id,date,min_temp,max_temp,condition) VALUES (${loc_id},${Forecast.date},${Forecast.min_temp},${Forecast.max_temp},${Forecast.condition})`,
    (err, result) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        res.status(400).send("Error creating user");
        return;
      }
      res.status(201).send("User created successfully");
    }
  );
  db.query(
    `INSERT INTO air_quality(location_id,aqi,description) VALUES (${loc_id},${airQuality.aqi},${airQuality.description})`,
    (err, result) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        res.status(400).send("Error creating user");
        return;
      }
      res.status(201).send("User created successfully");
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
