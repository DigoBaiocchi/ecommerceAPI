import { ReactNode } from "react";

type TableBodyProps<T> = {
    items: T[];
    renderItem: (item: T) => ReactNode;
};

export default function TableBody() {

}