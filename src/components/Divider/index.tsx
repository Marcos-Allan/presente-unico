export default function Divider() {
    return(
        <div className="w-full max-w-[700px] flex items-center justify-center mt-4">
            <div className="flex-grow-[1] h-[1px] bg-my-primary"></div>
            <p className="px-3 text-my-primary font-bold sm:px-[200px]">Ou</p>
            <div className="flex-grow-[1] h-[1px] bg-my-primary"></div>
        </div>
    )
}