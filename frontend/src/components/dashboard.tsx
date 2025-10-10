import { Key, Plus, PlusIcon } from "lucide-react"
import { Card } from "./cardComponent"
import { AccordionSideBar } from "./sideBarAccordion"
import { BottomLeft } from "@/assets/icons/bottomLeftIcon"
import { TopRight } from "@/assets/icons/topRightIcon"
import { LeftTopCorner } from "@/assets/icons/leftTopCornerIcon"
import { BottomRight } from "@/assets/icons/bottomRightIcon"




export const Dashboard = ({ orgs }: any) => {
    return (
        <div>
            {/* navbar */}
            <nav className=" backdrop-blur-md justify-between  w-screen fixed top-0 h-16 z-10 border-b-1 flex items-center px-16 tracking-tighter">
                <div className="font-satoshi-black">
                    nameoftheproject
                </div>

                <div className="relative w-[50%] border-1  font-satoshi-regular h-[50%] " >
                    <span className="absolute top-0  left-0   ">
                        <LeftTopCorner />
                    </span>
                    <span className="absolute    bottom-0 left-0   ">
                        <BottomLeft />
                    </span>

                    <input className="w-full px-2 flex items-center border-none focus:outline-none text-[#414148]  h-[100%]" type="text" placeholder="Search Orgs..." />

                    <span className="absolute    top-0 right-0   ">
                        <TopRight />
                    </span>
                    <span className="absolute    bottom-0 right-0   ">
                        <BottomRight />
                    </span>

                </div>

                {/* <div className="font-satoshi-bold">
                    go to the page
                </div> */}
            </nav>

            {/* orgs */}
            <div className="w-fit h-screen overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                <div className="flex flex-wrap content-start w-[calc(100%-20%)] pt-20 p-4">

                    {
                        Object.entries(orgs).map(([_, e]: any) => {
                            // return Object.entries(e).map(([keys, value]: any) => {
                            return <Card key={_} logoUrl={e.logoUrl} orgName={e.orgName} tagline={e.tagLine} tags={e.techContent || []} />
                            // return <div key={keys}>{JSON.stringify(value)}</div>
                            // })
                        })
                    }


                </div>

            </div>
            {/* Sidebar */}
            <div className=" w-1/5 h-full fixed right-0 top-16 z-20  ">
                {/* filters */}
                <div className="h-  20">

                </div>
                <div className="mt-0 h-full flex items-start p-3 font-satoshi-regular">
                    <AccordionSideBar />
                </div>

                {/* links */}
                <div className="bg-red-200 justify-center flex items-center absolute bottom-0 h-[8%] mb-16 w-full border-t-2">
                    links
                </div>
            </div>


        </div>
    )
}
