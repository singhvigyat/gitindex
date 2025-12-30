import { BottomLeft } from "@/assets/icons/bottomLeftIcon"
import { BottomRight } from "@/assets/icons/bottomRightIcon"
import { LeftTopCorner } from "@/assets/icons/leftTopCornerIcon"
import { TopRight } from "@/assets/icons/topRightIcon"
import { useEffect } from "react"
import Fuse from 'fuse.js'


export const SearchComp = ({ setOrgs, allOrgs, activeFilters, input, setInput }: any) => {



    useEffect(() => {
        // console.log("input is now ", input)
        // console.log(orgs)

        const allOrganizations = Object.values(allOrgs)

        const filteredOrgs = allOrganizations.filter((org: any) => {
            const yearMatch = activeFilters.years.length === 0 ||
                activeFilters.years.includes(Number(org.year));

            const topicMatch = activeFilters.topics.length === 0 ||
                org.topicContent?.some((t: any) => activeFilters.topics.includes(t));

            const techMatch = activeFilters.techs.length === 0 ||
                org.techContent?.some((t: any) => activeFilters.techs.includes(t));

            return yearMatch && topicMatch && techMatch;
        });

        if (!input.trim()) {
            setOrgs(filteredOrgs);
            return;
        }

        const options = {
            keys: ['orgName'],
            threshold: 0.4
        }
        const fuse = new Fuse(filteredOrgs, options)
        const results = fuse.search(input)

        const plainResults = results.map(result => result.item);
        setOrgs(plainResults)


    }, [input, allOrgs, activeFilters])


    return (
        <div className=" top-0 h-16 z-10 border-b-1 flex items-center ">

            <div className="relative border-1  font-satoshi-regular h-[50%]  w-full" >
                <span className="absolute top-0  left-0   ">
                    <LeftTopCorner />
                </span>
                <span className="absolute    bottom-0 left-0   ">
                    <BottomLeft />
                </span>

                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="w-full px-2 flex items-center border-none focus:outline-none text-[#414148]  h-[100%] "
                    type="text"
                    placeholder="Search Orgs..."
                />

                <span className="absolute    top-0 right-0   ">
                    <TopRight />
                </span>
                <span className="absolute    bottom-0 right-0   ">
                    <BottomRight />
                </span>

            </div>
        </div>
    )









}