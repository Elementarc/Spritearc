import React, { MutableRefObject, ReactElement, useCallback, useEffect, useRef, useState } from 'react';

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    recommendations?: string[]
    recommendationCallb?: (recommandation: string) => void
    inputRef?: MutableRefObject<HTMLInputElement | null>
}

const Input: React.FC<IInputProps> = ({ recommendationCallb, recommendations, inputRef ,...props }) => {
    const [ShowRecommendations, setShowRecommendations] = useState(false)
    const timerRef = useRef<null | NodeJS.Timer>(null)

    const createRecommendations = (inputRecommandations: string[]): ReactElement[] | null => {
        const recommendationsJsx: ReactElement[] = []

        if(inputRecommandations) {
            for(let recommandation of inputRecommandations) {
                recommendationsJsx.push(
                    <li key={recommandation} onClick={() => {
                        if(recommendationCallb) recommendationCallb(recommandation)
                    }}>
                        <p>{recommandation}</p>
                    </li>
                )
            }

            return recommendationsJsx
        }

        return null
    }

    const onBlur = useCallback(() => {
        if(timerRef.current) {
            clearTimeout(timerRef.current)
        }

        timerRef.current = setTimeout(() => {
            setShowRecommendations(false)
        }, 100);

    }, [timerRef, setShowRecommendations])
    

    useEffect(() => {
        
        return() => {
            if(timerRef.current) clearTimeout(timerRef.current)
        }
    }, [timerRef])
    return (
        <div className='custom_input_container'>
            <input onFocus={() =>setShowRecommendations(true) } onBlur={onBlur} ref={inputRef} {...props} />

            {recommendations && ShowRecommendations &&
                <div className='input_recommandations'>
                    <ul>
                        {createRecommendations(recommendations)}
                    </ul>
                </div>
            }
        </div>
    );
};

export default Input
