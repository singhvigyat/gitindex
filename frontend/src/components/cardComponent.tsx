import { Tag } from "./tagComponent"
interface cardProps {
    orgName: string,
    tagline: string
}
export const Card = ({ orgName, tagline }: cardProps) => {

    return (
        <div className="flex flex-1 border-1 border-[#DDDDED] min-w-[400px] max-w-[450px] p-[5px] min-h-[145px] max-h-[200px]  ">
            {/* Logo of the org */}
            <div className="bg-red-50 w-[30%] flex justify-center items-center ">
                logo
            </div>
            <div className="pl-5 pt-1 w-[70%]">
                <div className="text-ellipsis whitespace-nowrap overflow-hidden">
                    {orgName}
                </div>
                <div className="h-[25%] w-[80%] text-ellipsis whitespace-nowrap overflow-hidden  py-1">
                    {tagline}
                </div>
                <div className="flex gap-[5px] pt-1">
                    <Tag title="hello" />
                    <Tag title="second" />
                </div>
            </div>
        </div>
    )
}