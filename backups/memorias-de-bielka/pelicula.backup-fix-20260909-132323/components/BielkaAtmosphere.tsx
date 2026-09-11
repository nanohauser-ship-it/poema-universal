\
"use client";

type Props = {
  movementKey: string;
  localProgress: number;
  certainty: "hecho" | "ambiguo";
};

export function BielkaAtmosphere({
  movementKey,
  localProgress,
  certainty,
}: Props) {
  return (
    <div
      className={`baRoot ba-${movementKey} ${certainty === "ambiguo" ? "isAmbiguous" : ""}`}
      aria-hidden="true"
      style={
        {
          "--ba-local": localProgress,
        } as React.CSSProperties
      }
    >
      <div className="baVignette" />
      <div className="baMist" />
      <div className="baGrain" />
    </div>
  );
}
