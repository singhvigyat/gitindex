import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useState } from "react";

// currently if nothing is selected, then currentYear org is selected, by default (and it appears that it's unchecked -> that is the problem fix that )
// if default is again selected ? 
// if unchecked then how will we handle ? 
// if unchecked how to remove from the array ? 
// how to take care of the duplicate entries of orgs ? (while multiple years are selected) 

export function AccordionSideBar({ setYear, allOrgs }: any) {
    // const currentYear = new Date().getFullYear() - 1; // Default year
    const [isChecked, setIsChecked] = useState(true)

    const handler = (e: any) => {
        setYear((i: any) => e.target.checked ? [...i, 2024] : i.filter((x: any) => x != 2024))
        if(!e.target.checked) {
            
        }
        setIsChecked(!isChecked)
    }


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
                        {/* {`it is this ${setYear}`} */}
                        {/* <label className="flex items-center gap-2 px-4 text-xs cursor-pointer" >
                            <input
                                onChange={(e) => { setYear((i: any) => e.target.checked ? [...i, 2024] : i.filter((x: any) => x != 2024)) }}
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black     focus:ring-black cursor-pointer"
                                checked= {true}
                            />
                            All Orgs
                        </label> */}
                        <label className="flex items-center gap-2 px-4 text-xs cursor-pointer" >
                            <input
                                onChange={(e) => { handler(e) }}
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black     focus:ring-black cursor-pointer"
                                checked={isChecked}
                            />
                            2024
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs cursor-pointer" >
                            <input
                                onChange={(e) => { setYear((i: any) => e.target.checked ? [...i, 2023] : i.filter((x: any) => x != 2023)) }}
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black cursor-pointer"
                            />
                            2023
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs cursor-pointer" >
                            <input
                                onChange={(e) => { setYear((i: any) => e.target.checked ? [...i, 2022] : i.filter((x: any) => x != 2022)) }}
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black cursor-pointer"
                            />
                            2022
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs cursor-pointer" >
                            <input
                                onChange={(e) => { setYear((i: any) => e.target.checked ? [...i, 2021] : i.filter((x: any) => x != 2021)) }}
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black cursor-pointer"
                            />
                            2021
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs cursor-pointer" >
                            <input
                                onChange={(e) => { setYear((i: any) => e.target.checked ? [...i, 2020] : i.filter((x: any) => x != 2020)) }}
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black cursor-pointer"
                            />
                            2020
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs cursor-pointer" >
                            <input
                                onChange={(e) => { setYear((i: any) => e.target.checked ? [...i, 2019] : i.filter((x: any) => x != 2019)) }}
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black cursor-pointer"
                            />
                            2019
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs cursor-pointer" >
                            <input
                                onChange={(e) => { setYear((i: any) => e.target.checked ? [...i, 2018] : i.filter((x: any) => x != 2018)) }}
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black cursor-pointer"
                            />
                            2018
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs cursor-pointer" >
                            <input
                                onChange={(e) => { setYear((i: any) => e.target.checked ? [...i, 2017] : i.filter((x: any) => x != 2017)) }}
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black cursor-pointer"
                            />
                            2017
                        </label>
                        <label className="flex items-center gap-2 px-4 text-xs cursor-pointer" >
                            <input
                                onChange={(e) => { setYear((i: any) => e.target.checked ? [...i, 2016] : i.filter((x: any) => x != 2016)) }}
                                type="checkbox"
                                className="h-3 w-3 rounded border  accent-black focus:ring-black cursor-pointer"
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
