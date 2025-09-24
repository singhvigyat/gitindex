    import { Arrow } from "../assets/icons/arrowIcon"
    import { BottomLeft } from "../assets/icons/bottomLeftIcon"
    import { BottomRight } from "../assets/icons/bottomRightIcon.tsx"
    import { Github } from "../assets/icons/githubIcon"
    import { LeftTopCorner } from "../assets/icons/leftTopCornerIcon"
    import { Link } from "../assets/icons/linkIcon"
    import { Report } from "../assets/icons/reportIcon"
    import { TopRight } from "../assets/icons/topRightIcon"
    import { User } from "../assets/icons/userIcon"
    import { TagChip } from "./tagChip.tsx"
    interface cardProps {
        orgName: string,
        tagline: string,
        tags: any
    }
    export const Card = ({ orgName, tagline, tags }: cardProps) => {
        return (

            <div className="flex border border-[#DDDDED] w-1/2  min-h-[145px] max-h-[150px] ">
                {/* Logo of the org */}
                <span className="relative ">
                    <span className="absolute bottom-0 left-0   ">
                        <BottomLeft />
                    </span>
                </span>
                <div>
                    <LeftTopCorner />
                </div>
                <div className="w-[30%] flex justify-center items-center m-1 bg-amber-200">
                    logo
                </div>
                <div className="pl-5 pt-1 w-[65%]  ">
                    <div className="">
                        <div className="text-ellipsis whitespace-nowrap overflow-hidden font-satoshi-bold pt-1">
                            {orgName}
                        </div>
                        <div className="h-[25%] w-[80%] text-ellipsis whitespace-nowrap overflow-hidden font-satoshi-regular text-[#414148] pt-1 pb-1">
                            {tagline}
                        </div>
                        {/* tags */}
                        <div className="flex ">
                            <span className="flex gap-[5px] w-[90%] py-1 whitespace-nowrap  text-[#414148] items-center">
                                {
                                    // tags.map((ex le: any) => {
                                    //     return <Tag title={ele} />
                                    // })
                                    // < AutoChipGroup tags={tags}/>
                                    <TagChip tags={tags} />
                                }
                            </span>
                        </div>
                        <div className="cursor-pointer flex text-[12px] gap-2 font-satoshi-regular text-[#414148] ">
                            <div className="pt-3 flex items-center gap-1 hover:text-black ">
                                <Github />
                                Github
                            </div>
                            <div className="pt-3 flex items-center justify-center hover:text-black">
                                <Link />
                                <span className="pl-1">
                                    Website
                                </span>
                            </div>
                            <div className="pt-3 flex items-center justify-center hover:text-black">
                                <Report />
                                <span className="pl-1">
                                    Report
                                </span>
                            </div>
                            <div className="pt-3 flex items-center justify-center hover:text-black">
                                <User />
                                <span className="pl-1">
                                    Contact
                                </span>
                            </div>
                        </div>

                    </div>

                </div>

                <span className="pr-2 flex items-center text-[#414148] hover:text-black ">
                    <Arrow />
                </span>
                {/* <span className="relative">
                    <span className="absolute bottom-0 left-0  bg-blue-200 ">
                        <TopRight />
                    </span>
                </span> */}

                <span className="relative ">
                    <span className="absolute bottom-0 right-0  ">
                        <BottomRight />
                    </span>
                </span>

                <div className="relative ">
                    <span className="absolute right-0 top-0">
                        <TopRight />
                    </span>
                </div>
            </div>
        )
    }