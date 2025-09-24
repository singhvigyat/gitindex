import { Card } from "./cardComponent"




export const Dashboard = () => {
    return (
        <div>
            {/* navbar */}
            <nav className="bg-red-300 w-screen fixed top-0 h-16 z-10">
                hello
            </nav>
            {/* orgs */}
            <div className="pt-16 bg-black w-screen h-screen ">
                <div className="flex flex-wrap content-start bg-white w-[calc(100%-20%)] p-4 overflow-y-auto h-full 
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                    <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk' tags={["advanced data structures", "first", "no", "c++", "his is hti new first", "thle"]} />
                    <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk' tags={["advanced data structures", "first", "no", "c++", "his is hti new first", "thle"]} />
                    <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk' tags={["advanced data structures", "first", "no", "c++", "his is hti new first", "thle"]} />
                    <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk' tags={["advanced data structures", "first", "no", "c++", "his is hti new first", "thle"]} />
                    <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk' tags={["advanced data structures", "first", "no", "c++", "his is hti new first", "thle"]} />
                    <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk' tags={["advanced data structures", "first", "no", "c++", "his is hti new first", "thle"]} />
                    <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk' tags={["advanced data structures", "first", "no", "c++", "his is hti new first", "thle"]} />
                    <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk' tags={["advanced data structures", "first", "no", "c++", "his is hti new first", "thle"]} />
                    <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk' tags={["advanced data structures", "first", "no", "c++", "his is hti new first", "thle"]} />
                    <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk' tags={["advanced data structures", "first", "no", "c++", "his is hti new first", "thle"]} />
                    <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk' tags={["advanced data structures", "first", "no", "c++", "his is hti new first", "thle"]} />
                    <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk' tags={["advanced data structures", "first", "no", "c++", "his is hti new first", "thle"]} />
                </div>
                {/* filters */}
                <div className="bg-amber-400 w-1/5 h-full fixed right-0 top-16 z-20">
                    skdjfsjdlfjsdfjsdlfjkdfj
                    hello
                </div>
            </div>
        </div>
    )
}
