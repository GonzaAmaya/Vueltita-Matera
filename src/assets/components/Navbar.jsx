import { useState, useEffect } from "react";
import logo from "../../../public/logo_nav.webp";
import "../components/Navbar.css";

function Navbar(){
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = (e) => {
            const el = e.target === document ? document.documentElement : e.target;
            const y = Math.max(window.scrollY, el.scrollTop || 0);
            setScrolled(y > 50);
        };
        document.addEventListener("scroll", handleScroll, { capture: true, passive: true });
        return () => document.removeEventListener("scroll", handleScroll, { capture: true });
    }, []);

    return(
        <nav className={"nav ${scrolled ? 'scrolled' : ''}"}>
            <img src={logo} alt="Vueltita Matera" className="logo"/>

            <button className="boton-hamburguesa" onClick={() => setMenuAbierto(!menuAbierto)}>
                ☰
            </button>

            <ul className={`menu ${menuAbierto ? 'abierto' : ''}`}>
                <li><a href="#historia" className="nav-btn" onClick={() => setMenuAbierto(false)}>Historia</a></li>
                <li><a href="#mapa" className="nav-btn" onClick={() => setMenuAbierto(false)}>Mapa</a></li>
                <li><a href="#asistente" className="nav-btn" onClick={() => setMenuAbierto(false)}>Asistente</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;