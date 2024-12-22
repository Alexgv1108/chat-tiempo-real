import { useEffect, useState } from "react";

export const MessageSkeleton = () => {
    const [cantidad, setCantidad] = useState(0);

    useEffect(() => {
        const calcularCantidad = () => {
            const alturaPantalla = window.innerHeight - 140;
            const alturaSkeleton = 110;
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
                <div
                    className={`shadow-sm mb-3 rounded-lg p-4 bg-gray-200 animate-pulse ${index%2 === 0 ? 'ml-auto' : 'mr-auto'}`}
                    style={{
                        maxWidth: "85%",
                    }}
                    key={index}
                >
                    <div className="flex justify-between items-center">
                        <div className="w-full">
                            {/** Condicional para skeleton de audio */}
                            <div className="mt-4 w-full flex items-center">
                                <div className="w-[94%] h-5 bg-gray-300 rounded"></div>
                            </div>

                            {/** Condicional para skeleton de texto */}
                            <p className="mt-2 text-sm h-4 bg-gray-300 rounded w-3/4"></p>
                        </div>
                        <small className="ml-4 text-gray-400 h-3 w-16 bg-gray-300 rounded"></small>
                    </div>
                </div>
            ))}
        </>
    )
}