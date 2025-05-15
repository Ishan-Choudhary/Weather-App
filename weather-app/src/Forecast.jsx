import React from "react";

import Codes from "./codes.json";

const Forecast = ({heading, data, imageType}) =>  {

    return (
        <div className="my-5 px-5 rounded-lg text-neutral-50 text-300 px-1 dd">
            <p className="border-b-1 border-neutral-50 py-3">{heading}</p>
            <div className="flex items-center justify-between py-3">
                {
                    data.map(curr =>  (
                        <div className="flex flex-col items-center justify-between text-center h-[100px]" key={curr.label}>
                            <p>{curr.label}</p>
                            <img src={Codes[`${curr.weatherCode}`][imageType]} alt={Codes[`${curr.weatherCode}`]["des"]} className="size-7"/>
                            <p>{curr.temperature}°</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Forecast;