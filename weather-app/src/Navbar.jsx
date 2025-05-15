import React from "react";
import { useContext } from "react";

import { SearchContext } from "./SearchContext";

const Navbar = () => {

    const {city, changeCity} = useContext(SearchContext)

    return (
        <div className="py-10 w-full flex text-[#F9E2AF] justify-between font-poppins font-semibold px-5">
            <a className="cursor-pointer" onClick={() => changeCity("Mumbai")}>Mumbai</a>
            <a className="cursor-pointer" onClick={() => changeCity("Bengaluru")}>Bengaluru</a>
            <a className="cursor-pointer" onClick={() => changeCity("Hyderabad")}>Hyderabad</a>
            <a className="cursor-pointer" onClick={() => changeCity("Kolkata")}>Kolkata</a>
        </div>
    )
}

export default Navbar;