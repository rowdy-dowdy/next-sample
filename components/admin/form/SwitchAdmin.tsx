"use client"
import React, {FC, InputHTMLAttributes, useId} from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string | null | undefined,
}

const SwitchAdmin: FC<Props> = (props) => {
  const { className, label, ...rest } = props

  const id = useId()
  
  return (
    <div className={className}>
      { label ? 
        <label className="block text-sm font-medium mb-2 dark:text-white">
          {label} { props.required && <span className="text-red-500">*</span> }
        </label> 
        : null 
      }

      <input 
        type="checkbox" id={id} 
        className="relative w-[3.25rem] h-7 p-px bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-sky-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-sky-600 checked:border-sky-600 focus:checked:border-sky-600 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-sky-500 dark:checked:border-sky-500 dark:focus:ring-offset-gray-600 before:inline-block before:w-6 before:h-6 before:bg-white checked:before:bg-sky-200 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-gray-400 dark:checked:before:bg-sky-200" 
        {...rest} />
      <label htmlFor={id} className="sr-only">switch</label>
    </div>
  )
}

export default SwitchAdmin