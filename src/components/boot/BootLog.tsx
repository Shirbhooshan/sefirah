import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function BootLog({ children }: Props) {
    return (
        <section className="mt-6 flex min-h-0 flex-1 flex-col">

            <div className="border-b border-neutral-700 px-12 py-2 text-xs tracking-[0.3em] text-neutral-500">
                SYSTEM INITIALIZATION
            </div>

            <div
                id="boot-scroll"
                className="min-h-0 flex-1 overflow-y-auto px-12 pt-5 pb-20"
            >
                <div className="space-y-1">
                    {children}
                    <div className="h-20" />
                </div>
            </div>

        </section>
    );
}