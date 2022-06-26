import React, { useCallback } from 'react';

export default function Steps(props: {steps: number, currentStep: number, setCurrentStep: (targetStep: number) => void, availableSteps: number[]}) {
    const steps = props.steps
    const currentStep = props.currentStep
    const availableSteps = props.availableSteps
    const setCurrentStep = props.setCurrentStep

    async function goToStep(targetStep: number) {
        if(availableSteps.includes(targetStep)) return setCurrentStep(targetStep)
    }
    //Function that takes in the number of steps that needs to be created!
    const createSteps = useCallback(() => {
        const steps_jsx = []
        for(let i = 1; i < steps + 1; i++) {
            steps_jsx.push(

                <div className='step_container' key={`step_${i}`}>

                    <div onClick={() => goToStep(i)} className={`step ${currentStep === i ? 'target' : i < currentStep ? 'possible' : availableSteps.includes(i) ? 'possible' : 'inactive'}`} id={`step_${i}`} data-step={`${i}`}>
                        <p>Step {i}</p>
                    </div>

                    {i < steps &&
                        <span />
                    }
                    
                </div>
            )

        }

        return steps_jsx
    }, [currentStep, availableSteps])
    
    return (
        <div className="step_displayer_container">
            
            {createSteps()}

        </div>
    );
}
