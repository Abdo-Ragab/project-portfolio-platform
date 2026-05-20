import React from 'react'

const StepIndicator = ({ activeStep }) => {
    const activeStepClassName = 'bg-[#4F39F6] w-12 h-2 rounded-full transition-colors duration-200';
    const inactiveStepClassName = 'bg-[#E2E8F0] w-12 h-2 rounded-full transition-colors duration-200';

    if (!activeStep) {
        activeStep = false;
    }

    return (
        <div className={activeStep ? activeStepClassName : inactiveStepClassName} />
    )
}

export default StepIndicator