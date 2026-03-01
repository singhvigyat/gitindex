import { AccordionSideBar } from "./sideBarAccordion"
import { PaginationComp } from "./ui/paginationComp"
import { SearchComp } from "./searchComponent"
import { useState } from "react";





export const Dashboard = ({ setOrgs, orgs, setYear, allOrgs, allYears, allTopics, allTechnologies, setActiveFilters, activeFilters }: any) => {
     const [input, setInput] = useState('');
    return (
        <div className="">
            {/* navbar */}
            <nav className=" backdrop-blur-md justify-between w-screen fixed top-0 h-16 z-10 border-b-1 flex items-center px-16 tracking-tighter">
                <div className="font-satoshi-black">
                    gitindex
                </div>
                <div className="w-1/3 hidden sm:block">
                    <SearchComp input={input} setInput={setInput} orgs={orgs} setOrgs={setOrgs} allOrgs={allOrgs} activeFilters={activeFilters} />
                </div>
            </nav>

            {/* orgs */}
            <div className="w-screen h-screen " >
                <PaginationComp orgs={orgs} />
            </div>

            {/* Sidebar */}
            <div className=" w-1/5 h-full fixed right-0 top-16 z-20 border-l-1  ">
                {/* filters */}
                <div className="h-20">
                </div>
                <div className="mt-0 h-full flex items-start p-3 font-satoshi-regular">
                    <AccordionSideBar setInput={setInput} activeFilters={activeFilters} allTopics={allTopics} allTechnologies={allTechnologies} allYears={allYears} setActiveFilters={setActiveFilters} setYear={setYear} allOrgs={allOrgs} />
                </div>

                {/* links */}
                <div className="bg-red-200 justify-center flex items-center absolute bottom-0 h-[8%] mb-16 w-full border-t-2">
                    links
                </div>
            </div>


        </div>
    )
}
