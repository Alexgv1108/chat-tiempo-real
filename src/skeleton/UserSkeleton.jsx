import { useState, useEffect } from "react";

export const AmigoSkeleton = () => {
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    const calcularCantidad = () => {
      const alturaPantalla = window.innerHeight - 130;
      const alturaSkeleton = 72;
      const cantidadSkeletons = Math.floor(alturaPantalla / alturaSkeleton);
      setCantidad(cantidadSkeletons);
    };

    calcularCantidad();
    window.addEventListener("resize", calcularCantidad);

    return () => {
      window.removeEventListener("resize", calcularCantidad);
    };
  }, []);

  return (
    <>
      {[...Array(cantidad)].map((_, index) => (
        <li key={index} className="flex items-center py-2 cursor-pointer p-2">
          {/* Contenedor del texto */}
          <div className="flex-1">
            {/* Línea superior */}
            <div className="bg-gray-300 animate-pulse mb-2 h-5 w-7/12 rounded"></div>
            {/* Línea inferior */}
            <div className="bg-gray-300 animate-pulse h-4 w-1/2 rounded"></div>
          </div>

          {/* Indicador de estado */}
          <div className="flex items-center ml-auto">
            <div className="bg-gray-300 animate-pulse rounded-full h-3 w-3"></div>
          </div>
        </li>
      ))}
    </>
  );
};
