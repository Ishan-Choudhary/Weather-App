const express = require("express");
const countries = require("i18n-iso-countries");
const geoTz = require("geo-tz");
const cors = require("cors");
const {rateLimit} = require("express-rate-limit");
require("dotenv").config();

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
const app = express();
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(limiter);

app.use(cors(
	{
		origin: ["http://localhost:5173"],
	},
));

app.get("/", async (request, response) => {
    const getWeather = async (location) =>  {
        const options = {
            method: "GET",
            headers:    {
                accept: "application/json",
                "accept-encoding": "deflate, gzip, br"
            }
        }

        const key = process.env.WEATHER_KEY


        const forecasts = (isoTimeStr, lat, lon) =>   {

            const [timeZone] = geoTz.find(lat, lon);
            
            return new Intl.DateTimeFormat("en-US", {
                timeZone,
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            }).format(new Date(isoTimeStr));
        }

        try {
            const forecastReq = await fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${location}&apikey=${key}`, options);
            const realtimeReq = await fetch(`https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=${key}`, options);

            const forecastData = await forecastReq.json();
            const realtimeData = await realtimeReq.json(); 

            if (forecastData.code === 400001 || realtimeData.code === 400001)   {
                throw   {
                    status: 400,
                    message: "Invalid city name"
                };
            }
            else if(forecastData.code === 429001 || realtimeData.code === 429001)   {
                throw   {
                    status: 429,
                    message: "Too many requests! Please wait and try again!"
                }
            }
            else if (!forecastData.location || !realtimeData.data) {
                throw {
                    status: 500,
                    message: "Weather data is incomplete or malformed."
                };
            }
            
            let lat = forecastData.location.lat;
            let lon = forecastData.location.lon;
            let loc = forecastData.location.name.split(",").map(curr => curr.trim());
            loc = [loc[0], countries.getAlpha2Code(loc[loc.length - 1], "en")].join(", ")

            let {hourly, daily} = forecastData.timelines;
            daily = daily.slice(0, -1).map(curr => curr = {
                label: new Date(curr.time).toDateString().split(" ")[0],
                temperature: curr.values.temperatureAvg,
                weatherCode: curr.values.weatherCodeMax,
            });
            hourly = hourly.slice(0, 5).map(curr => curr = {
                temperature: curr.values.temperature,
                weatherCode: curr.values.weatherCode,
                label: forecasts(curr.time, lat, lon)
            });

            let realTimeData = {
                temperature: realtimeData.data.values.temperature,
                realTemperature: realtimeData.data.values.temperatureApparent,
                humidity: realtimeData.data.values.humidity,
                windSpeed: realtimeData.data.values.windSpeed,
                weatherCode: realtimeData.data.values.weatherCode,
                sunrise: forecasts(forecastData.timelines.daily[0].values.sunriseTime, lat, lon),
                sunset: forecasts(forecastData.timelines.daily[0].values.sunsetTime, lat, lon),
                tempMax: forecastData.timelines.daily[0].values.temperatureMax,
                tempMin: forecastData.timelines.daily[0].values.temperatureMin,
            }


            return {daily, hourly, loc, lat, lon, realTimeData};
        }
        catch (error) {
            if (error.status) {
                throw error;
            }

            throw {
                status: 500,
                message: "An unexpected error occurred while fetching weather data."
            };
        }
    }

    try {
        const weatherData = await getWeather(request.query.location);
        response.status(200).json(weatherData);
    }
    catch (error)   {
        const status = error.status || 500;
        const message = error.message || "Internal server error";
        response.status(status).json({ message })
    }
})

app.listen(3000, "0.0.0.0", () => console.log("App is online on port 3000"))
