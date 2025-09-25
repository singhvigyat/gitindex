import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionSideBar() {
    return (
        <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
        >
            <AccordionItem value="item-1">
                <AccordionTrigger className="font-satoshi-bold">Years</AccordionTrigger>
                <AccordionContent className="flex flex-col  text-[#414148] ">
                    <div className="flex flex-wrap flex-3 w-full">

                        <label className="flex items-center gap-2 px-4 text-xs">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black"
                            />
                            2024
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black"
                            />
                            2023
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black"
                            />
                            2022
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black"
                            />
                            2021
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black"
                            />
                            2020
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black"
                            />
                            2019
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black"
                            />
                            2018
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black"
                            />
                            2017
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black"
                            />
                            2016    
                        </label>
                    </div>
                </AccordionContent>
            </AccordionItem>
      
            <AccordionItem value="item-3">
                <AccordionTrigger className="font-satoshi-bold">Technologies</AccordionTrigger>
                <AccordionContent className="flex flex-col  text-balance text-[#414148] ">
                  <div className="w-full  mr-2 flex flex-wrap ">

                        <label className="flex items-center gap-2 px-4 text-xs">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black"
                            />
                            csdfdsfsdfsdsdfsdsdfsdfdsf
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black"
                            />
                            c++sdfdfsdfdsdfsdfsdfsdfsdf 
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black"
                            />
                            assembly
                        </label>
                     
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger className="font-satoshi-bold">Topics</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance text-[#414148] ">
                 <div className="flex flex-wrap w-full">

                        <label className="flex items-center gap-2 px-4 text-xs">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black"
                            />
                            2024
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black"
                            />
                            2023
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black"
                            />
                            2022
                        </label>
                     
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
