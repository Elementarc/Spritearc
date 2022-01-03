import React, { useEffect } from 'react';

export default function Steps({steps, current_step, steps_available}: {steps: number, current_step: number, steps_available: number[]}) {
    const c_step = current_step
    //Function that takes in the number of steps that needs to be created!
    function create_steps(steps: number) {
        const steps_jsx = []

        for(let i = 0; i < steps; i++) {

            steps_jsx.push(

                <div className='step_items_container' key={`step_${i}`}>

                    <div className="step step_inactive" data-step={`${i}`}>
                        <p id="step_1">Step {i + 1}</p>
                    </div>

                    {i + 1 < steps &&
                        <span />
                    }
                    
                </div>
            )

        }

        return steps_jsx
    }

    //Setting styles for steps whenever signup_obj & current_step changes
    useEffect(() => {
        const steps = Array.from(document.getElementsByClassName("step") as HTMLCollection)
        
        for(let i = 0; i < steps.length; i++) {
            
            //Adding step_done class whenever a step gets available
            if(steps_available.length === 0) {
                steps[i].classList.add("step_inactive")
                steps[i].classList.remove("step_focus")
                steps[i].classList.remove("step_done")
            } else {
                steps[i].classList.add("step_inactive")
                steps[i].classList.remove("step_focus")
                steps[i].classList.remove("step_done")
                for(let n = 0; n < steps_available.length; n++ ) {
                    
                    if(steps[i].getAttribute("data-step") === `${steps_available[n]}`) {
                        console.log(steps[i])
                        steps[i].classList.remove("step_inactive")
                        steps[i].classList.remove("step_focus")
                        steps[i].classList.add("step_done")
                    }
                    
                }
            }

            //Setting current step always focus
            if(i === c_step) {
                
                steps[i].classList.add("step_focus")
                steps[i].classList.remove("step_done")
                steps[i].classList.remove("step_inactive")
                
            }

            //Prev steps will always have step_done class
            if(i < c_step) {
                steps[i].classList.remove("step_inactive")
                steps[i].classList.remove("step_focus")
                steps[i].classList.add("step_done")
            }
        }

    }, [current_step, steps_available])

    return (
        <div className="steps_container">
            
            {create_steps(steps)}

        </div>
    );
}
