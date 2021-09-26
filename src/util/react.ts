import { debounce } from "lodash";
import {
    DependencyList,
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

export type SetValue<T> = Dispatch<SetStateAction<T>>;

export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay == null) return;

        const id = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(id);
    }, [delay]);
}

export function useInitial(func: () => any) {
    useEffect(() => {
        func();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
    const [storedValue, setStoredValue] = useState<T>(readValue);

    const setValue: SetValue<T> = value => {
        try {
            const newValue = value instanceof Function ? value(storedValue) : value;
            window.localStorage.setItem(key, JSON.stringify(newValue));
            setStoredValue(newValue);
        } catch (error) {
            console.warn(`Error setting localStorage key “${key}”:`, error);
        }
    };

    useInitial(() => {
        setStoredValue(readValue());
    });

    return [storedValue, setValue];

    function readValue(): T {
        try {
            const item = window.localStorage.getItem(key);
            if (item == null) return initialValue;
            return JSON.parse(item) as T;
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    }
}

export type SimpleForm = { [key: string]: string | number | boolean };
export type SetSimpleForm<T extends SimpleForm> = Dispatch<SetStateAction<Partial<T>>>;

export function useSimpleForm<T extends SimpleForm>(initialValue: T): [T, SetSimpleForm<T>] {
    const [form, setForm] = useState(initialValue);

    const setPartialForm: SetSimpleForm<T> = value => {
        const newPartialForm = value instanceof Function ? value(form) : value;
        setForm(f => ({
            ...form,
            ...newPartialForm,
        }));
    };

    return [form, setPartialForm];
}

export function useDebouncedMemo<T>(
    factory: () => T,
    deps: DependencyList | undefined,
    debounceMs: number
): T {
    const [state, setState] = useState(factory());

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSetState = useCallback(debounce(setState, debounceMs), []);

    useEffect(() => {
        debouncedSetState(factory());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return state;
}

export function useUuid() {
    const [id] = useState(() => uuidv4());
    return id;
}
