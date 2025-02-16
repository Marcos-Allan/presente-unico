//TIPAGEM DAS PROPS DO COMPONENETE
interface Props {
    size: String,
    active: Boolean
    onClick: () => any,
}

export default function ChoiceSizeCard(props: Props) {
    return (
        <button
            onClick={() => props.onClick()}
            className={`w-[30.8%] mb-2 flex items-center flex-col justify-between mr-2 py-4 rounded-[6px]
                ${props.active == true ? 'bg-my-secondary text-[#efefef]' : 'bg-[#efefef] text-my-secondary'}
            `}
        >
            <p className={`text-[18px] font-bold uppercase`}>{props.size}</p>
        </button>
    )
}