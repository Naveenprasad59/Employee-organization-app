// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(callback: T, delay = 100) => {
    let timeoutId: number | undefined = undefined;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {callback(...args)}, delay)
    }
}