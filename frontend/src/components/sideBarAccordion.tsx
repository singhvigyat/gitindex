import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionSideBar({ allYears, allTopics, allTechnologies, setActiveFilters, activeFilters, setInput }: any) {

    // const currentYear = new Date().getFullYear() - 1; // Default year

    const yearHandler = (e: any, year: number) => {
        console.log("came here for year: ", year)

        if (e.target.checked) {
            setActiveFilters((prev: any) => ({
                ...prev,
                years: [...prev.years, year]
            })
            )

        }
        else {
            setActiveFilters((prev: any) => ({
                ...prev,
                years: prev.years.filter((x: number) => x !== year)
            }))

        }

        setInput('')
    }

    const topicHandler = (e: any, topic: String) => {
        console.log("came here for topic: ", topic)

        if (e.target.checked) {
            setActiveFilters((prev: any) => ({
                ...prev,
                topics: [...prev.topics, topic]
            })
            )

        }
        else {
            setActiveFilters((prev: any) => ({
                ...prev,
                topics: prev.topics.filter((x: String) => x !== topic)
            }))
        }

        setInput('')
    }

    const technologiesHandler = (e: any, technology: String) => {
        console.log("came here for topic: ", technology)

        if (e.target.checked) {
            setActiveFilters((prev: any) => ({
                ...prev,
                techs: [...prev.techs, technology]
            })
            )

        }
        else {
            setActiveFilters((prev: any) => ({
                ...prev,
                techs: prev.techs.filter((x: String) => x !== technology)
            }))
        }

        setInput('')
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
                            allYears.map((ele: any, index: any) => (
                                <label key={index} className="flex w-1/4 items-center gap-2  text-xs cursor-pointer" >
                                    <input
                                        checked={activeFilters.years.includes(ele)}
                                        onChange={(e) => { yearHandler(e, ele) }}
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

            <AccordionItem value="item-2">
                <AccordionTrigger className="font-satoshi-bold">Technologies</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance text-[#414148] ">
                    {/* <div className=""> */}
                    <div className="flex flex-wrap w-full gap-1.5 justify-center h-[30vh] overflow-auto">
                        {
                            allTechnologies.map((ele: any, index: any) => (
                                <label key={index} className="flex w-full items-center gap-2  text-xs cursor-pointer" >
                                    <input
                                        checked={activeFilters.techs.includes(ele)}
                                        onChange={(e) => { technologiesHandler(e, ele) }}
                                        type="checkbox"
                                        className="h-3 w-3 rounded border  accent-black     focus:ring-black cursor-pointer"
                                    />
                                    {(ele)}
                                </label>
                            ))
                        }
                    </div>
                    {/* <div className="bg-red-300">
                            View all
                            </div> */}

                    {/* </div> */}
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
                <AccordionTrigger className="font-satoshi-bold">Topics</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance text-[#414148] ">
                    <div className="">
                        <div className="flex flex-wrap w-full gap-1.5 justify-center h-[30vh] overflow-auto">
                            {
                                allTopics.map((ele: any, index: any) => (
                                    <label key={index} className="flex w-full items-center gap-2  text-xs cursor-pointer" >
                                        <input
                                            checked={activeFilters.topics.includes(ele)}
                                            onChange={(e) => { topicHandler(e, ele) }}
                                            type="checkbox"
                                            className="h-3 w-3 rounded border  accent-black     focus:ring-black cursor-pointer"
                                        />
                                        {(ele)}
                                    </label>
                                ))
                            }
                        </div>
                        {/* <div className="bg-red-300">
                            View all
                            </div> */}

                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
