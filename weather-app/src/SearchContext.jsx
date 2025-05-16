import { createContext, useEffect, useState } from "react";

export const SearchContext = createContext("");

const SearchProvier = ({children}) =>   {
    const [city, setCity] = useState("");

    useEffect( () => {
        const getCity = async () => {
            const cityReq = await fetch('http://ip-api.com/json/');
            const cityRes = await cityReq.json()
            setCity(cityRes.city)
        }

        getCity();
    }, [])

    const changeCity = (locName) => {
        setCity(locName);
    }

    return (
        <SearchContext.Provider value={{city, changeCity}}>
            {children}
        </SearchContext.Provider>
    )
}

export default SearchProvier;