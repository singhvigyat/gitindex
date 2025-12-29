import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect, useState } from "react";

// remove the redundant code from this file. 

export function AccordionSideBar({ setYear, allOrgs, allYears }: any) {

    // const currentYear = new Date().getFullYear() - 1; // Default year
    const [selectedYear, setSelectedYear] = useState<number[]>([]);
    // const [allOrgsChecked, setAllOrgsChecked] = useState(true)

    useEffect(() => {
        console.log("inside useeffect ", selectedYear)
        if (selectedYear.length === 0) {
            console.log("selected year is empty", selectedYear)
            setYear(Object.keys(allOrgs))
            console.log("done setting to all orgs")
        } else
            setYear(selectedYear);

    }, [selectedYear, setYear])

    const handler = (e: any, year: number) => {
        // setYear((i: any) => e.target.checked ? [...i, 2024] : i.filter((x: any) => x != 2024))
        console.log("came here for year: ", year)

        if (e.target.checked) {
            // selectedYear.push(year)
            setSelectedYear((previousSelectedYear: number[]) => {
                return [...previousSelectedYear, year];
            })
            // console.log(selectedYear)
        }
        else {
            setSelectedYear((previousSelectedYear: number[]) => {
                return previousSelectedYear.filter((x: number) => x !== year);
            })

            // console.log(selectedYear)
            console.log(`${year} unselected`, "selected year length ", selectedYear.length)


        }
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

                    <div className="flex flex-wrap w-full gap-1.5 justify-center">
                       
                        {
                           allYears.map((ele: any, index:any) => (
                                <label key={index} className="flex w-1/4 items-center gap-2  text-xs cursor-pointer" >
                                    <input
                                        onChange={(e) => { handler(e, ele) }}
                                        type="checkbox"
                                        className="h-3 w-3 rounded border  accent-black     focus:ring-black cursor-pointer"
                                    />
                                    {(ele)}
                                </label>
                           ))
                        }
                        

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
