/** Dispatch event on click outside of node */
export function clickOutside(node: HTMLElement, callback: () => void) {
    const handleClick = (event: any) => {
        if (node && !node.contains(event.target) && !event.defaultPrevented)
            callback()
    }

    document.addEventListener("click", handleClick, true)
    document.addEventListener("contextmenu", handleClick, true)

    return {
        destroy() {
            document.removeEventListener("click", handleClick, true)
            document.removeEventListener("contextmenu", handleClick, true)
        },
    }
}
