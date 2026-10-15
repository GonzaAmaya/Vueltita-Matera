import { useState } from "react";
import "../components/historia.css";

function Historia(){
    return(
        <>
            <section className="historia">
                <h2 className="titulo">Historia Argentina</h2>
                <section className="texto-principal">
                    <p>Es el octavo país más grande del mundo, un destino de inmensos contrastes que maravilla con paisajes extremos que van desde la selva y las Cataratas del Iguazú en el norte hasta los imponentes glaciares de la Patagonia en el sur. Su identidad vibra en la calidez de su gente, siempre dispuesta a compartir la tradición del mate, y se refleja en grandes pasiones como el tango y el fútbol. El país conquista también por su famosa gastronomía, donde brillan el clásico asado, el vino Malbec y el dulce de leche, mientras que su capital, Buenos Aires, deslumbra con su arquitectura europea, su inagotable oferta cultural y una intensa vida nocturna que invita a disfrutar de cenas tardías recién a partir de las nueve de la noche.</p>
                </section>
                <div className="estadisticas">
                    <ul>
                        <li>23 provincias y 1 Ciudad Autónoma</li>
                        <li>+46 millones de habitantes</li>
                        <li>+12 comidas tradicionales</li>
                    </ul>
                </div>
            </section>
        </>
    );
}

export default Historia;