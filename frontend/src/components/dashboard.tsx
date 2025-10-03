import { Key } from "lucide-react"
import { Card } from "./cardComponent"
import { AccordionSideBar } from "./sideBarAccordion"




export const Dashboard = ({ orgs }: any) => {
    return (
        <div>
            {/* navbar */}
            <nav className="font-satoshi-black w-screen fixed top-0 h-16 z-10 border-b-1 flex items-center px-16 tracking-tighter">
                nameoftheproject
            </nav>

            {/* orgs */}
            <div className="pt-16  w-screen h-screen border-r-1  ">
                <div className="flex flex-wrap content-start bg-white w-[calc(100%-20%)] p-4 overflow-y-auto h-full 
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 ">
                    {/* <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk' tags={["advanced data structures", "first", "no", "c++", "his is hti new first", "thle"]} />
                    <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk' tags={["advanced data structures", "first", "no", "c++", "his is hti new first", "thle"]} /> */}

                    {
                        // Object.entries(orgs).map(([_, value]:any)=>{
                        //     return Object.entries(value).map(([k ,v]:any)=>{
                        //         return <div key={k}>{JSON.stringify(v.orgName)}</div>
                        //     })
                        // })

                        Object.entries(orgs).map(([_, e]: any) => {
                            return Object.entries(e).map(([keys, value]: any) => {
                                return <Card orgName={value.orgName} tagline={"ehllo this is the tagline"} tags={value.techContent} />
                                return <div key={keys}>{JSON.stringify(value.orgName)}</div>
                            })
                        })

                    }


                </div>
                <div className=" w-1/5 h-full fixed right-0 top-16 z-20 border-l-1 ">
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
        </div>
    )
}
