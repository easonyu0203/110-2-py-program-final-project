import React from 'react'

type Props = {
    stepNum: number,
    children: string,
}

const StepDesc = (props: Props) => {
  return (
    <div className=" max-w-[18rem] flex justify-center items-center h-24 space-x-3">
        <div className=' border-2 rounded-full border-orange-600 bg-slate-50 text-orange-500 min-w-[1.5rem] h-6 text-center font-bold text-sm'>{props.stepNum}</div>
        <div className=' flex-initial text-sm'>{props.children}</div>
    </div>
  )
}

export default StepDesc