//TIPAGEM DAS PROPS DO COMPONENTE
interface Props {
    text: String,
    validate: Boolean,
    event?: () => any
}

export default function Button(props: Props) {
    return(
        <button
            onClick={() => props.event && props.event()}
            className={`w-full max-w-[700px] flex items-center justify-center py-5 mt-5 rounded-[8px] font-bold font-inter text-[18px] text-my-white cursor-pointer border-[2px] hover:bg-transparent focus:bg-transparent transition-all duration-[.3s] focus:outline-none
                ${props.validate == false && 'bg-my-gray hover:text-my-gray border-my-gray focus:text-my-gray'}
                ${props.validate == true && 'bg-my-secondary hover:text-my-secondary border-my-secondary focus:text-my-secondary'}
            `}
        >
            {props.text}
        </button>
    )
}