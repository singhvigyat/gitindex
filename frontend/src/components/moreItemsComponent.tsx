import { Tag } from "./tagComponent"

interface MoreChip {
    more: Number
}

export const More = ({ more }: MoreChip) => {
    return (
        <Tag title={`+ ${more}`} />
    )
}