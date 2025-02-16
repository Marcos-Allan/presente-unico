//IMPORTAÇÃO DAS BIBLIOTECAS
import { useNetworkStatus } from "use-network-status";

export default function NetworkStatus({ children }: { children: React.ReactNode }) {
    const { online }: any = useNetworkStatus();
    const isLocalhost = window.location.hostname.includes("localhost")
    
    console.log(isLocalhost)

  if (!online && isLocalhost == false) {
    return (
        <div className={`w-screen h-screen flex items-center justify-center text-my-secondary text-[48px] font-bold uppercase`}>
            Offline
        </div>
    )
  }

  return <>{children}</>;
}