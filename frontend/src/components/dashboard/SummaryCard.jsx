import React from 'react'

const SummaryCard = ({icon, text, number, color}) => {
    return (
        <div className="rounded-xl flex bg-white shadow-lg hover:shadow-2xl border border-cyan-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
            <div className={`text-4xl flex justify-center items-center ${color} text-white px-6 bg-gradient-to-br`}>
                {icon}
            </div>
            <div className="pl-6 py-4">
                <p className="text-sm font-poppins font-semibold text-slate-600 uppercase tracking-wide">{text}</p>
                <p className="text-3xl font-bold font-poppins text-slate-800 mt-1">{number}</p>
            </div>
        </div>
    )
}

export default SummaryCard