import React from "react";

export function useState<T>(initialValue: T): { value: T; set(v: T): void } {
    const [value, setValue] = React.useState(initialValue);
    return { value, set: setValue };
}
