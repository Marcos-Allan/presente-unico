//TIPAGEM DAS PROPS DO COMPONENETE
interface Props {
    quantity: Number,
    priceProduct: String,
    priceProductQuantity: String,
    active: Boolean,
    onClick: () => any,
}

export default function ChoiceQuantityCard(props: Props) {
    return(
        <button
            onClick={() => props.onClick()}
            className={`w-[30.8%] mb-2 bg-[#efefef] flex items-center flex-col justify-between mr-2 rounded-[8px] p-2 border-[2px] ${props.active == true ? 'border-my-primary' : 'border-transparent'}`}
        >
            <p className={`text-my-secondary text-center w-full font-bold text-[14px]`}>{Number(props.quantity)} unidade{Number(props.quantity) >= 2 && 's'}</p>
            <div className={`bg-my-secondary w-full h-[2px] my-2`}></div>
            <p className={`text-[18px] font-bold text-my-primary uppercase`}>R${String(Number(props.priceProduct).toFixed(2)).replace('.', ',')}</p>
            <p className={`text-[12px] font-bold text-[#bcbcbc] uppercase`}>R${Number(props.priceProductQuantity)} / un</p>
        </button>
    )
}