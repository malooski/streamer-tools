export interface TextInputProps {
    value: string;

    onValueChange(value: string): void;
}

export default function TextInput() {
    return <input type="text" />;
}
