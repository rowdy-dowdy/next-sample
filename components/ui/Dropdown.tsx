"use client"
import { useClickOutside } from '@/lib/ultis/clickOutside';
import { useFloating, offset, flip, shift, autoUpdate, FloatingFocusManager, useClick, useDismiss, useRole, useInteractions, Placement } from '@floating-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import React, { useState, HTMLAttributes, useRef, ReactNode, memo, FC } from 'react'
import { twMerge } from "tailwind-merge";

type State = HTMLAttributes<HTMLElement> & {
  renderItem: (rest: any, isOpen: boolean) => ReactNode,
  placement?: Placement
}

const Dropdown: React.FC<State> = (props) => {
  const { renderItem, className, placement, children, ...rest } = props

  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(5), flip(), shift()],
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role
  ]);

  return (
    <>
      {/* <span className='inline-block' ref={refs.setReference} {...getReferenceProps()}> */}
        {renderItem({ref: refs.setReference, ...getReferenceProps()}, isOpen)}
      {/* </span> */}
      
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={twMerge(`min-w-[15rem] bg-white shadow-md border rounded-lg p-2 dark:bg-gray-800 dark:border dark:border-gray-700`, className)}
          >
            {children}
          </div>
        </FloatingFocusManager>
      )}
    </>
  )
}

export const Divide = (props: HTMLAttributes<HTMLDivElement>) => {
  const {className, children, ...rest} = props

  return <hr className={twMerge("my-2 border-gray-200 dark:border-gray-700", className)} {...rest} />
}

type StateMenuItem = HTMLAttributes<HTMLDivElement> 
& ({ LinkComponent: FC<any> | string, href: string } | { LinkComponent?: undefined, href?: undefined })
& {
  icon?: ReactNode | string
}

export const MenuItem = (props: StateMenuItem) => {
  const {LinkComponent, className, children, href, icon, ...rest} = props

  const Tag = LinkComponent ?? 'div'

  return (
    <Tag href={href} className={twMerge("flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-700", className)} tabIndex={-1} {...rest}>
      { typeof icon === "string" ? <span className='icon w-4 h-4 text-lg'>{icon}</span> : icon }
      {children}
    </Tag>
  )
}

export const MenuTitle = (props: HTMLAttributes<HTMLDivElement>) => {
  const {className, children, ...rest} = props
  return (
    <span className={twMerge("block py-2 px-3 text-xs font-medium uppercase text-gray-400 dark:text-gray-500", className)} {...rest} >
      {children}
    </span>
  )
}

export default memo(Dropdown)