import clsx from "clsx";

export default function FormProgressIndicator({currentStep, steps, className}: { currentStep: number, steps: string[], className?: string}) {
return (
        <div className={clsx("grid grid-rows-1 grid-flow-col grid-cols-[repeat(auto-fit,minmax(0,1fr))] justify-center", className)}>
            {steps.map((step, index) => (
                <div key={step} className="flex flex-col items-center gap-0.5">
                    <div className={clsx("w-10 h-10 rounded-full inline-flex flex-col items-center", currentStep == index && "bg-primary" || "bg-content1" )}>
                        <span className="m-auto">{index + 1}</span>
                    </div>
                    <span className="text-center">{steps[index]}</span>
                </div>
            ))}
        </div>
    )
}