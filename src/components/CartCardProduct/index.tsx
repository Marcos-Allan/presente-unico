//IMPORTAÇÃO DAS BIBLIOTECAS
import { useState } from 'react'
import { useDrag } from '@use-gesture/react';

//IMPORTAÇÃO DOS ICONES
import { CiEdit } from 'react-icons/ci';


export default function CartCardProduct({ item, setProductSelectedEdit, removeItem, navigate }: any) {
    const [dragMovement, setDragMovement] = useState(0);

    // Configuração de drag com o use-gesture
    const bind = useDrag(state => {
        const { movement: [xMovement], last } = state;
        const limitedMovement = Math.min(Math.max(xMovement, -200), 200); // Limita o movimento entre -200px e 200px

        setDragMovement(limitedMovement);

        if (last) {
            if (limitedMovement < -50) {
                console.log("Swipe Left");
                removeItem(item.id)
            } else if (limitedMovement > 50) {
                console.log("Swipe Right");
            }

            // Após o movimento, o item volta para o lugar original
            setDragMovement(0); // Volta o item à posição inicial
        }

        return {
            style: {
                
                transform: `translateX(${limitedMovement}px)`, // Aplica a transformação de movimento horizontal
                transition: last ? 'transform 0.3s ease-out' : 'none', // Transição suave após o movimento
            },
        };
    }, {
        axis: 'x', // Restringe o movimento ao eixo X (horizontal)
        rubberband: true, // Efeito de "esticamento" quando o limite é ultrapassado
    });

    return (
        <div
            {...bind()}
            data-id={item.id}
            className="cart-item w-[85%] bg-[#efefef] h-[80px] rounded-[8px] flex flex-row items-center justify-between mb-4 relative px-3"
            style={{ touchAction: 'none', transform: `translateX(${dragMovement}px)` }} // Aplica a posição de acordo com o movimento
        >
            <div className="absolute top-[-8px] left-[-8px] text-[12px] text-my-white bg-my-secondary rounded-[50%] w-[20px] text-center flex items-center justify-center h-[20px]">
                {item.quantity}
            </div>
            {item.estampa && <img src={item.estampa} alt="" className="w-[70px]" />}
            <div className="flex-grow-[1] flex flex-row items-center justify-between">
                <img src={item.image} alt="" className="w-[80px] h-[80px]" />
                <div>
                    <p className="font-bold text-my-secondary text-[14px]">{item.name}</p>
                    <p className="font-bold text-my-primary text-[14px]">R${item.price} uni</p>
                </div>
                <div
                    onClick={() => {
                        localStorage.setItem('productPUE', JSON.stringify(item));
                        setProductSelectedEdit(item);
                        navigate(`/cart/edit/${item.name}`);
                    }}
                    className="bg-my-secondary w-8 h-8 flex items-center justify-center absolute top-[-20px] right-[-20px] rounded-[50%]"
                >
                    <CiEdit className="text-[24px] text-my-white" />
                </div>
            </div>
        </div>
    );
};