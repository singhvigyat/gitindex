import { useState } from "react";
import { Tag } from "./tagComponent"
import { OverflowList } from "react-overflow-list";
import { PopoverDemo } from "./popOver";
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover";

// import * as Popover from "@radix-ui/react-popover";

interface TagChipProps {
    tags: string[]
}

const ItemRenderer = (item: any, index: number) => {
    return <Tag key={index} title={item} />
}



export const TagChip: React.FC<TagChipProps> = ({ tags }) => {
    const [overflowItems, setoverflowItems] = useState<string[]>([])

    const OverflowRenderer = (items: any) => {
        return (
            <Popover onOpenChange={(open) => open && setoverflowItems(tags)}>
                <PopoverTrigger asChild>
                    <div className=" cursor-pointer" >
                        <Tag title={`+${items.length}`} />
                    </div >
                </PopoverTrigger>
                {/* <Popover.Portal> */}
                <PopoverContent className="z-50 bg-white shadow-lg  w-[60%] border-[#DDDDED]  border-1">
                    <PopoverDemo tags={overflowItems} />
                </PopoverContent>
                {/* </Popover.Portal> */}
            </Popover>

        )
    }

    return (
        <div className="w-full ">
            <OverflowList
                collapseFrom="end"
                minVisibleItems={0}
                items={tags}
                itemRenderer={ItemRenderer}
                overflowRenderer={OverflowRenderer}
            />
            {/* {showPopOver && <PopoverDemo tags={overflowItems} />} */}
        </div>
    )
}