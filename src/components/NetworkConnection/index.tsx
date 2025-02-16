//IMPORTAÇÃO DAS BIBLIOTECAS
import { useEffect, useState } from "react";

export default function NetworkStatus({ children }: { children: React.ReactNode }) {
    const [online, setOnline] = useState(true);

    useEffect(() => {
        const checkOnlineStatus = async () => {
            try {
                await fetch("https://www.google.com", { mode: "no-cors" });
                setOnline(true);
            } catch (error) {
                setOnline(false);
            }
        };
    
        const interval = setInterval(checkOnlineStatus, 3000); // Checa a cada 3s

        window.addEventListener("online", () => setOnline(true));
        window.addEventListener("offline", () => setOnline(false));
    
        return () => {
            clearInterval(interval);
            window.removeEventListener("online", () => setOnline(true));
            window.removeEventListener("offline", () => setOnline(false));
        };
    }, []);

    if (!online) {
        return (
            <div className="w-screen h-screen flex items-center justify-center text-my-secondary text-[48px] font-bold uppercase">
                Offline
            </div>
        );
    }

    return <>{children}</>;
}
