interface TagProps {
    title: string
}


export const Tag = ({ title }: TagProps) => {
    return (
        <span>
            <span className="bg-[#DDDDED] min-w-fit py-1 px-2 font-satoshi-bold rounded-lg text-center justify-center text-xs">
                {title}
            </span>
        </span>
    )
}