import Navbar from "./Navbar";
import MainApp from "./MainApp";
import SearchProvier from "./SearchContext";
import "./App.css";

function App() {



  return (
    <div className="relative bg-radial-[at_10%_15%] from-[#a66a16] via-[#B25009] to-[#C0430B] w-full min-h-screen flex justify-center">
        <div className=" self-start min-w-[320px] w-1/2">
          <SearchProvier>
            <Navbar />
            <MainApp />
          </SearchProvier>
        </div>
        <footer className="text-slate-50 absolute bottom-0">Powered by: Tomorrow.io</footer>
    </div>
  )
}

export default App

/*bg-red-500*/