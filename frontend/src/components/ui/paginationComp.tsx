import { useEffect, useReducer, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Card } from "../cardComponent";

export const PaginationComp = ({ orgs }: any) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 50;

    const allOrgs = (orgs && Array.isArray(orgs))
        ? orgs.reduce((accumulator, currentYearObject) => {
            // 1. extract the org objects (the values)
            const currentOrgs = Object.values(currentYearObject);

            // 2. add all these values to a new array
            return accumulator.concat(currentOrgs);
        }, [])
        : [];


    const totalItems = allOrgs.length;

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let currentItems = allOrgs.slice(startIndex, endIndex);
    console.log("current items", currentItems)

    console.log("current items", currentItems.length)
    let pageNumbers = []

    for (let i = 0; i < totalPages; ++i) {
        pageNumbers.push(i);
    }

    const handleLinkClick = (e: any, currentPage: number) => {
        e.preventDefault();
        if (currentPage < 1 || currentPage > totalPages) return;
        setCurrentPage(currentPage)
    }

    useEffect(() => {
        if (currentItems.length === 0) {
            setCurrentPage(1);
        }
    }, [currentItems])


    return (
        <div>
            <div className="flex flex-wrap content-start w-[calc(100%-20%)] pt-20 p-4">

                {currentItems && currentItems.length > 0 ? (
                    currentItems.map((item: any, index: number) =>
                        <Card
                            key={startIndex + index}
                            orgName={item.orgName}
                            tagline={item.tagLine}
                            tags={item.techContent || []}
                            logoUrl={item.logoUrl}
                        />

                    )
                ) : (
                    <p>No items to display</p>
                )}
            </div>
            <Pagination className="font-satoshi-bold pb-5 cursor-pointer  " >
                <PaginationContent>

                    <PaginationItem onClick={(e) => {
                        if (currentPage > 1) {
                            handleLinkClick(e, currentPage - 1);
                        } else {
                            e.preventDefault();
                        }
                    }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}>
                        <PaginationPrevious href="#" />
                    </PaginationItem>

                    <PaginationItem onClick={(e) => handleLinkClick(e, currentPage)} >
                        <PaginationLink href="#">{currentPage}</PaginationLink>
                    </PaginationItem>

                    <PaginationItem onClick={(e) => handleLinkClick(e, currentPage + 1)} className={currentPage + 1 > totalPages ? 'pointer-events-none opacity-50' : ''} >
                        <PaginationLink href="#">{currentPage + 1 <= totalPages ? currentPage + 1 : ''}</PaginationLink>
                    </PaginationItem>

                    <PaginationItem onClick={(e) => handleLinkClick(e, currentPage + 2)} className={currentPage + 2 > totalPages ? 'pointer-events-none opacity-50' : ''} >
                        <PaginationLink href="#">{currentPage + 2 <= totalPages ? currentPage + 2 : ''}</PaginationLink>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationEllipsis>

                        </PaginationEllipsis>
                    </PaginationItem>

                    <PaginationItem onClick={(e) => {
                        if (currentPage !== totalPages) {
                            handleLinkClick(e, currentPage + 1);
                        } else {
                            e.preventDefault();
                        }
                    }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>


        </div>
    )
}


