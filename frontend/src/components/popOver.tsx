
import { Tag } from "./tagComponent"

interface PopoverTagsProps {
    tags: string[]
}

export function PopoverTags({ tags }: PopoverTagsProps) {
    return (
     
                <div className="w-full flex flex-col  gap-4 font-satoshi-regular  "  >
                    <div>
                        Tags
                    </div>
                    <div className="whitespace flex flex-wrap  ">
                        {
                            tags.map(ele =>
                                <Tag title={ele} />
                            )
                        }
                    </div>
                </div>
    )
}
