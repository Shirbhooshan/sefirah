interface Props {
  label: string;
}

export default function DockIcon({
  label,
}: Props) {
  return (
    <button className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 transition-all duration-200 hover:-translate-y-2 hover:scale-110 hover:bg-white/20">

      {label}

    </button>
  );
}