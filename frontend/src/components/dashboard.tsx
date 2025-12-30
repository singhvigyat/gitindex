import { AccordionSideBar } from "./sideBarAccordion"
import { PaginationComp } from "./ui/paginationComp"
import { SearchComp } from "./searchComponent"





export const Dashboard = ({setOrgs, orgs, setYear, allOrgs, allYears, allTopics, allTechnologies, setActiveFilters, activeFilters }: any) => {
    return (
        <div className="">
            {/* navbar */}
            <nav className=" backdrop-blur-md justify-between w-screen fixed top-0 h-16 z-10 border-b-1 flex items-center px-16 tracking-tighter">
                <div className="font-satoshi-black">
                    nameoftheproject
                </div>
                <div className="w-1/3 hidden sm:block">
                    <SearchComp orgs={orgs} setOrgs={setOrgs} allOrgs={allOrgs}/>
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
                    <AccordionSideBar activeFilters={activeFilters} allTopics={allTopics} allTechnologies={allTechnologies} allYears={allYears} setActiveFilters={setActiveFilters} setYear={setYear} allOrgs={allOrgs} />
                </div>

                {/* links */}
                <div className="bg-red-200 justify-center flex items-center absolute bottom-0 h-[8%] mb-16 w-full border-t-2">
                    links
                </div>
            </div>


        </div>
    )
}
