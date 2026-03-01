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
    tags: any,
    logoUrl: string,
    githubLink: string,
    websiteLink: string,
    url: string
}
export const Card = ({ orgName, tagline, tags, logoUrl, githubLink, websiteLink, url }: cardProps) => {
    return (

        <div className="flex border border-[#DDDDED] w-full md:w-1/2 2xl:w-1/3 min-h-[145px] ">
            {/* Logo of the org */}
            <span className="relative ">
                <span className="absolute bottom-0 left-0   ">
                    <BottomLeft />
                </span>
            </span>
            <div>
                <LeftTopCorner />
            </div>
            <div className="w-16 md:w-20 lg:w-24 shrink-0 flex justify-center items-center m-1">
                <img
                    src={`${logoUrl}`}
                    alt="example"
                    style={{ maxHeight: '90%', maxWidth: '100%' }}
                />
            </div>
            <div className="pl-3 md:pl-5 pt-1 min-w-0 flex-1 overflow-hidden">
                <div className="">
                    <div className="truncate font-satoshi-bold pt-1 pb-1">
                        {orgName}
                    </div>
                    <div className="w-[80%] truncate font-satoshi-regular text-[#414148] pt-1 pb-1 text-sm ">
                        {tagline}
                    </div>
                    {/* tags */}
                    <div className="flex ">
                        <span className="flex gap-[5px] w-[90%] py-1 whitespace-nowrap  text-[#414148] items-center overflow-hidden">
                            {
                                <TagChip tags={tags} />
                            }
                        </span>
                    </div>
                    <div className="cursor-pointer flex flex-wrap text-[12px] gap-x-2 gap-y-1 font-satoshi-regular text-[#414148] ">
                        <div className="pt-2 md:pt-3 flex items-center gap-1 hover:text-black ">
                            <Github />
                            <a href={githubLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                Github
                            </a>
                        </div>
                        <div className="pt-2 md:pt-3 flex items-center justify-center hover:text-black">
                            <Link />
                            <span className="pl-1">
                                <a
                                    href={websiteLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    Website
                                </a>
                            </span>
                        </div>
                        <div className="pt-2 md:pt-3 flex items-center justify-center hover:text-black">
                            <Report />
                            <span className="pl-1">
                                Report
                            </span>
                        </div>
                        <div className="pt-2 md:pt-3 flex items-center justify-center hover:text-black">
                            <User />
                            <span className="pl-1">
                                Contact
                            </span>
                        </div>
                    </div>

                </div>

            </div>

            <span className="pr-2 flex items-center text-[#414148] hover:text-black ">
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Arrow />
                </a>

            </span>

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