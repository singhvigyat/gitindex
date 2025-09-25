interface TagProps {
    title: string
}


export const Tag = ({ title }: TagProps) => {
    return (
        <span className="pr-1">
            <span className="bg-[#E2E2E2] min-w-fit py-1 px-2 font-satoshi-bold rounded-lg text-center justify-center text-xs">
                {title}
            </span>
        </span>
    )
}