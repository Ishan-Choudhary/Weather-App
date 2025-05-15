import React from "react";

import Codes from "./codes.json";
import Forecast from "./Forecast";
import Thermometer from "./assets/icons/thermometer.svg"
import Wind from "./assets/icons/wind.svg"
import Drop from "./assets/icons/drop.svg"
import Sun from "./assets/icons/sunrise.svg"
import Sunset from "./assets/icons/sunset.svg"

const Dashboard = ({location, daily, hourly, today}) => {
    const dayOrNight = (sunsetTime) =>   {
        const [time, modifier] = sunsetTime
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours != 12)   {
            hours += 12
        }
        if (modifier === "AM" && hours === 12)  {
            hours = 0
        }

        const givenTime = new Date();
        givenTime.setHours(hours, minutes, 0, 0);

        return new Date() > givenTime
    }

    const timeOfDay = dayOrNight(today.sunset) ? "imageNight" : "imageDay"
    return (
        <div className="animation-(animate-fade-in-scale) loc px-2 h-full">
            <p className="text-2xl md:text-3xl font-[400] text-neutral-50 text-center">{location}</p>
            <p className="text-emerald-300 text-lg md:text-xl text-center">{Codes[`${today.weatherCode}`].des}</p>
            <div className="w-full pt-10 flex justify-between items-center">
                <img src={Codes[`${today.weatherCode}`][timeOfDay]} alt="Weather icon" className="size-18"/>
                <p className="text-4xl md:text-5xl font-[400] text-neutral-50">{today.temperature}°</p>
                <div className="flex flex-col items-start h-full gap-4">
                    {[
                        {icon: Thermometer, label: "Real feel:", value: `${today.temperature}°`},
                        {icon: Drop, label: "Humidity:", value: `${today.humidity}%`},
                        {icon: Wind, label: "Wind:", value:`${today.windSpeed}km/h`}
                    ].map((curr, i) =>  (
                        <React.Fragment key={i}>
                            <p className="text-neutral-50 font-poppins">
                                <img src={curr.icon} alt={curr.label} className="size-5 inline" />
                                {curr.label} {curr.value}
                            </p>        
                        </React.Fragment>
                    ))
                    }
                    
                </div>
            </div>
            <div className="pt-5 text-neutral-50 flex items-center justify-between">
                {[
                    { icon: Sun, label: "Rise", time: today.sunrise },
                    { icon: Sunset, label: "Set", time: today.sunset },
                    { icon: Sun, label: "High", time: `${today.tempMax}°` },
                    { icon: Sun, label: "Low", time: `${today.tempMin}°` },
                ].map((item, index) => (
                    <React.Fragment key={index}>
                        <div className="inline-flex items-center gap-1 w-[76.98px] lg:w-fit">
                            <img src={item.icon} alt={item.label} className="size-6" />
                            {item.label}: {item.time}
                        </div>
                        {index !== 3 && (
                            <div className="w-0.5 bg-neutral-50 self-stretch" />
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div>
                <Forecast heading={"HOURLY FORECAST"} data={hourly} imageType={timeOfDay} />
                <Forecast heading={"DAILY FORECAST"} data={daily} imageType={timeOfDay}/>
            </div>
        </div>
    )
}

export default Dashboard;