import wallpaperImg from '@/assets/wallpapers/wallpaper.png';

export default function Wallpaper() {
    return (
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(11, 11, 15, 0.6), rgba(0, 0, 0, 0.8)), url(${wallpaperImg.src})`
            }}
        />
    );
}