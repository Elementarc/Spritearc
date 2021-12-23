import React, { useEffect } from 'react';

export default function Steps({steps, current_step, next_step_available}: {steps: number, current_step: number, next_step_available: boolean}) {
    const c_step = current_step
    //Function that takes in the number of steps that needs to be created!
    function create_steps(steps: number) {
        const steps_jsx = []

        for(let i = 0; i < steps; i++) {

            steps_jsx.push(

                <div className='step_items_container' key={`step_${i}`} >

                    <div className="step step_inactive" >
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
            
            //Setting current step always focus
            if(i === c_step) {
                
                steps[i].classList.add("step_focus")
                steps[i].classList.remove("step_done")
                steps[i].classList.remove("step_inactive")
                
            } else {

                steps[i].classList.add("step_inactive")
                steps[i].classList.remove("step_focus")
                steps[i].classList.remove("step_done")
                
            }

            if(i < c_step) {
                steps[i].classList.remove("step_inactive")
                steps[i].classList.remove("step_focus")
                steps[i].classList.add("step_done")
            }
        }

    }, [current_step])

    //Setting style when next_step is available
    useEffect(() => {
        const steps = Array.from(document.getElementsByClassName("step") as HTMLCollection)
        
        if(next_step_available === true) {

            if(steps[c_step + 1]) {
                steps[c_step + 1].classList.remove("step_inactive")
                steps[c_step + 1].classList.remove("step_focus")
                steps[c_step + 1].classList.add("step_done")
            }
            
        } else {

            if(steps[c_step + 1]) {

                steps[c_step + 1].classList.add("step_inactive")
                steps[c_step + 1].classList.remove("step_focus")
                steps[c_step + 1].classList.remove("step_done")

            }
        }

    }, [current_step, next_step_available])

    return (
        <div className="steps_container">
            
            {create_steps(steps)}

        </div>
    );
}
