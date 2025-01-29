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
            className={`w-[30.8%] mb-2 bg-[#efefef] flex items-center flex-col justify-between mr-2 p-1 rounded-[8px] border-[2px]
                ${props.active == true ? 'border-my-primary' : 'border-transparent'}
            `}
        >
            <p className={`text-[18px] font-bold text-my-secondary uppercase`}>{props.size}</p>
        </button>
    )
}