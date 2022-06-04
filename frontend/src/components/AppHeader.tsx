import React from 'react'

type Props = {}

const AppHeader = (props: Props) => {
  return (
    <div className='flex justify-between items-center w-full flex-initial basis-20 bg-slate-300'>
        <div className=' m-6 border-2 rounded border-slate-800 p-2 bg-orange-200'>logo</div>
        <div className=' border-2 rounded border-slate-800 p-2 bg-orange-200'>Title: Spreadsheat Sender</div>
        <div className='m-6  border-2 rounded border-slate-800 p-2 bg-orange-200'>navigation bar</div>
    </div>
  )
}

export default AppHeader