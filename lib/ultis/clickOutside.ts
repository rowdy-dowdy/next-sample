import { useEffect, useLayoutEffect, useRef } from "react";

const useClickOutside = (ref: any, cb: () => void) => {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target) && !event.defaultPrevented) {
        cb()
      }
    }
    document.addEventListener("mousedown", handleClickOutside, false);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, false);
    };
  }, [ref]);
}

function useResizeObserver<T extends HTMLElement>(
  callback: (target: T, entry: ResizeObserverEntry) => void
) {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const element = ref?.current

    if (!element) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) {
        return;
      }

      const { borderBoxSize, contentBoxSize } = entries[0];

      // Lấy kích thước phù hợp (tùy chọn)
      const size = borderBoxSize?.[0] || contentBoxSize?.[0];

      if (size) {
        callback(element, entries[0]);
      }
    })

    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [callback, ref])

  return ref
}

export { useClickOutside, useResizeObserver }