"use client"
import { FloatingPortal, Placement, autoUpdate, flip, offset, shift, useDismiss, useFloating, useFocus, useHover, useInteractions, useMergeRefs, useRole } from '@floating-ui/react';
import React, { HTMLAttributes, useState } from 'react'

type Props = {
  children?: React.ReactNode,
  placement?: Placement,
  title: string
}

const Tooltip = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: props.placement || "top",
    // Make sure the tooltip stays on the screen
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: "start"
      }),
      shift({ padding: 10 })
    ]
  })

  // Event listeners to change the open state
  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  // Role props for screen readers
  const role = useRole(context, { role: "tooltip" });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role
  ]);

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()}>
        {props.children}
      </span>

      <FloatingPortal>
        {isOpen && (
          <div
            className="w-max inline-block py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {props.title}
          </div>
        )}
      </FloatingPortal>
    </>
  )
}

export default Tooltip