export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg overflow-hidden">
                <img
                    src="/logoUniversidadMariana.png"
                    alt="logoUniversidadMariana"
                    className="size-21 object-cover"/> 
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-semibold">
                    Sistema de Egresados Unimar
                </span>
            </div>
        </>
    );
}