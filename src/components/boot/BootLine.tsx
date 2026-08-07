type BootStatus = "OK" | "WARN" | "INFO";

interface BootLineProps {
  text: string;
  status?: BootStatus;
}

const LINE_WIDTH = 72;

export default function BootLine({
  text,
  status,
}: BootLineProps) {
  if (!status) {
    return (
      <div className="whitespace-pre text-[#d4d4d4]">
        {text}
      </div>
    );
  }

  const dots = ".".repeat(
    Math.max(LINE_WIDTH - text.length, 4)
  );

  const color =
    status === "OK"
      ? "text-green-400"
      : status === "WARN"
        ? "text-yellow-400"
        : "text-sky-400";

  return (
    <div className="whitespace-pre">

      {text}

      <span className="text-neutral-600">
        {dots}
      </span>

      <span className={` ${color}`}>
        {" "}
        [ {status} ]
      </span>

    </div>
  );
}