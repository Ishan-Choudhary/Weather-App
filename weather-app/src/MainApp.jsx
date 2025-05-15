import React from "react";
import {
    useState,
    useEffect,
    useContext
} from "react";
import { MagnifyingGlassIcon,} from "@heroicons/react/16/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import {find} from "browser-geo-tz";
import { DateTime } from "luxon";

import Loading from "./Loading";
import Dashboard from "./Dashboard";
import { SearchContext } from "./SearchContext";
const MainApp = () =>  {

    const {city, changeCity} = useContext(SearchContext);
    const [cityInput, setCityInput] = useState("");
    const [error, setError] = useState("");
    const [date, setDate] = useState(DateTime.now());
    const [location, setLocation] = useState("");
    const [dailyData, setDailyData] = useState({});
    const [hourlyData, setHourlyData] = useState({});
    const [todayData, setTodayData] = useState({});

    useEffect(() => {
        const getWeather = async () => {
            const req = await fetch(`http://localhost:3000/?location=${city}`);
            const data = await req.json();
            let daily, hourly, loc, lat, lon, realTimeData;

            if(data.message)    {
                setError(data.message);
                console.log(data.message);
            }
            else    {
                ({daily, hourly, loc, lat, lon, realTimeData} = data);
                const [tz] = await find(lat, lon);
                const nowInTz = DateTime.now().setZone(tz);
                setDate(nowInTz);
                setLocation(loc);
                setDailyData(daily);
                setHourlyData(hourly);
                setTodayData(realTimeData)
                setError("");
            }           
        }

        if(city) getWeather();

    }, [city])

    const handleKeyDown = (e) =>    {
        if (e.key === "Enter")  {
            handleSearch();
        }
    }
    
    const handleSearch = async (e) => {
        changeCity(cityInput);
    }

    return (
        
        <div className="w-full">
            <div className="w-full flex justify-between px-5 relative">
                <input type="text" placeholder="Search for city.." value={cityInput} onChange={(e) => setCityInput(e.target.value)} onKeyDown={handleKeyDown} className="outline-0 bg-[#FFFFFF] pl-3 py-1 w-65/100 search-bar"/>
                <div className="flex items-center w-1/7 xl:w-1/10  justify-between">
                    <MagnifyingGlassIcon className="size-5 text-white" onClick={handleSearch}/>
                    <MapPinIcon className="size-5 text-white" />
                </div>
            </div>
            {error && <p className="ml-5 font-bold text-slate-50 bg-red-400 text-xs md:text-sm w-fit text-wrap">{error}</p>}
            <div className="flex flex-col items-center pt-7">
                <p className="text-xl md:text-2xl font-[200] text-neutral-50 cursor-default select-none">{date.toFormat("ccc MMM dd yyyy")} | Local time: {date.toFormat("HH:mm")}</p>
                <div className="pt-10 w-full">
                    {
                        location == "" ? <Loading /> : <Dashboard location={location} daily={dailyData} hourly={hourlyData} today={todayData}/>
                    }
                </div>
            </div>
        </div>
    )
}

export default MainApp;