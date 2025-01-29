//TIPAGEM DAS PROPS DO COMPONENTE
interface Props {
    image: String,
    name: String,
    price: String,
    onClick: () => any
}

export default function ProductCard(props: Props) {

    const price1 = props.price.split(',')[0]
    const price2 = props.price.split(',')[1]

    return(
        <div
            onClick={() => props.onClick()}
            className="flex items-center justify-start flex-col bg-my-pink w-[40%] sm:w-3/12 py-1 px-2 rounded-[16px] mx-[5px] mt-4 cursor-pointer hover:scale-[1.07] transition-all duration-[.3s]"
        >
            <div className="flex items-center justify-center w-[90px] h-[90px]">
                <img src={`${props.image}`} alt="" className={`w-auto h-auto`} />
            </div>
            <h1 className={`text-my-secondary font-inter font-bold ${props.name == 'Almochaveiro' ? 'text-[20px]' : 'text-[24px]'}`}>{props.name}</h1>
            <p className={`text-[13px] font-bold font-inter text-center`}>a partir de <span className={`text-my-primary`}>
                    R$
                    <span className={`text-[20px]`}>
                        {price1}
                    </span>
                    ,{price2}
                </span>
            </p>
        </div>
    )
}