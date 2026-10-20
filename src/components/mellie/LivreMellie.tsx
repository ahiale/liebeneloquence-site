import Image from "next/image";

/* La BD « Mellie a le trac » en 3D (CSS) : couverture, dos, tranche des pages.
   La couverture s'ouvre régulièrement (et au survol) sur la page des personnages et la première planche.
   Visuels tirés du PDF par communication/mellie/preparer-images.py. */
export function LivreMellie({ className = "" }: { className?: string }) {
  return (
    <div className={`livre-scene ${className}`} aria-hidden="true">
      <div className="livre">
        <div className="livre-interieur">
          <Image src="/mellie/planche-ruche.webp" alt="" fill loading="eager" sizes="(max-width: 640px) 220px, 320px" style={{ objectFit: "cover" }} />
        </div>
        <div className="livre-tranche" />
        <div className="livre-dos">
          <span>MELLIE A LE TRAC · LEQ.</span>
        </div>
        <div className="livre-couverture">
          <div className="livre-recto">
            <Image src="/mellie/couverture.webp" alt="" fill loading="eager" sizes="(max-width: 640px) 220px, 320px" style={{ objectFit: "cover" }} />
            <span className="livre-reflet" />
          </div>
          <div className="livre-verso">
            <Image src="/mellie/personnages.webp" alt="" fill loading="eager" sizes="(max-width: 640px) 220px, 320px" style={{ objectFit: "cover" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
