import bootLogo from '@/assets/media/boot-logo.png';

export default function BootHeader() {
    return (
        <header className="border-b border-neutral-700 px-8 py-6">
            <div className="flex items-start gap-6">
                <div className="flex h-24 w-24 items-center justify-center">
                    <img
                        src={typeof bootLogo === 'string' ? bootLogo : bootLogo.src}
                        alt="sefirah"
                        className="h-full w-full object-contain"
                    />
                </div>

                <div>
                    <h1 className="text-2xl tracking-[0.45em]">
                        sefirah
                    </h1>
                    <p className="mt-2 text-neutral-500">
                        Virtual Operating Environment
                    </p>
                    <p className="text-sm text-neutral-600">
                        Firmware v0.1.0
                    </p>
                    <p className="text-sm text-neutral-600">
                        Build 01
                    </p>
                </div>
            </div>
        </header>
    );
}