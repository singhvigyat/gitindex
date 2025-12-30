import { BottomLeft } from "@/assets/icons/bottomLeftIcon"
import { BottomRight } from "@/assets/icons/bottomRightIcon"
import { LeftTopCorner } from "@/assets/icons/leftTopCornerIcon"
import { TopRight } from "@/assets/icons/topRightIcon"
import { useEffect, useState } from "react"
import Fuse from 'fuse.js'


export const SearchComp = ({ orgs, setOrgs, allOrgs }: any) => {

    const [input, setInput] = useState('');

    useEffect(() => {
        console.log("input is now ", input)
        console.log(orgs)

        const allOrganizations = Object.values(allOrgs)

        if (!input.trim()) {
            setOrgs(allOrganizations);
            return;
        }

        const options = {
            keys: ['orgName'],
            threshold: 0.4
        }
        const fuse = new Fuse(allOrganizations, options)
        const results = fuse.search(input)

        const plainResults = results.map(result => result.item);
        // console.log(op)  
        setOrgs(plainResults)


    }, [input, allOrgs])


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