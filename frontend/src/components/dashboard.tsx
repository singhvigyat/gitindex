import { AccordionSideBar } from "./sideBarAccordion"
import { PaginationComp } from "./ui/paginationComp"
import { SearchComp } from "./searchComponent"
import { useState, useEffect } from "react";

export const Dashboard = ({ setOrgs, orgs, setYear, allOrgs, allYears, allTopics, allTechnologies, setActiveFilters, activeFilters }: any) => {
    const [input, setInput] = useState('');
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    // Track viewport width for conditional rendering
    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    // Close drawer when switching to desktop
    useEffect(() => {
        if (isDesktop) setIsFilterDrawerOpen(false);
    }, [isDesktop]);

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isFilterDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isFilterDrawerOpen]);

    return (
        <div className="w-full">
            {/* ── Navbar ── */}
            <nav className="backdrop-blur-md bg-white/80 justify-between w-full fixed top-0 h-16 z-30 border-b flex items-center px-4 lg:px-16 tracking-tighter">
                <div className="font-satoshi-black text-lg">
                    gitindex
                </div>

                {/* Desktop search — always visible ≥1024px */}
                <div className="w-1/3 hidden lg:block">
                    <SearchComp input={input} setInput={setInput} orgs={orgs} setOrgs={setOrgs} allOrgs={allOrgs} activeFilters={activeFilters} />
                </div>

                {/* Mobile action buttons — visible <1024px */}
                <div className="flex items-center gap-3 lg:hidden">
                    {/* Search toggle */}
                    <button
                        onClick={() => { setIsMobileSearchOpen(prev => !prev); }}
                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                        aria-label="Toggle search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </button>

                    {/* Filter toggle */}
                    <button
                        onClick={() => setIsFilterDrawerOpen(true)}
                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                        aria-label="Open filters"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" x2="4" y1="21" y2="14" />
                            <line x1="4" x2="4" y1="10" y2="3" />
                            <line x1="12" x2="12" y1="21" y2="12" />
                            <line x1="12" x2="12" y1="8" y2="3" />
                            <line x1="20" x2="20" y1="21" y2="16" />
                            <line x1="20" x2="20" y1="12" y2="3" />
                            <line x1="2" x2="6" y1="14" y2="14" />
                            <line x1="10" x2="14" y1="8" y2="8" />
                            <line x1="18" x2="22" y1="16" y2="16" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* ── Mobile search bar (slides down below navbar) ── */}
            {isMobileSearchOpen && !isDesktop && (
                <div className="fixed top-16 left-0 w-full z-20 bg-white border-b px-4 py-2 lg:hidden">
                    <SearchComp input={input} setInput={setInput} orgs={orgs} setOrgs={setOrgs} allOrgs={allOrgs} activeFilters={activeFilters} />
                </div>
            )}

            {/* ── Main content area ── */}
            <div className="w-full min-h-screen lg:pr-[20%]">
                <PaginationComp orgs={orgs} />
            </div>

            {/* ── Desktop Sidebar (sticky, ≥1024px) ── */}
            <div className="hidden lg:block w-1/5 h-full fixed right-0 top-16 z-20 border-l">
                <div className="h-20"></div>
                <div className="mt-0 h-full flex items-start p-3 font-satoshi-regular">
                    <AccordionSideBar setInput={setInput} activeFilters={activeFilters} allTopics={allTopics} allTechnologies={allTechnologies} allYears={allYears} setActiveFilters={setActiveFilters} setYear={setYear} allOrgs={allOrgs} />
                </div>
                <div className="justify-center flex items-center absolute bottom-0 h-[8%] mb-16 w-full border-t-2">
                </div>
            </div>

            {/* ── Mobile/Tablet Filter Drawer (<1024px) ── */}
            {isFilterDrawerOpen && !isDesktop && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 transition-opacity"
                        onClick={() => setIsFilterDrawerOpen(false)}
                    />
                    {/* Drawer panel */}
                    <div className="absolute right-0 top-0 h-full w-[85%] max-w-[380px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Drawer header */}
                        <div className="flex items-center justify-between px-4 py-4 border-b">
                            <span className="font-satoshi-bold text-lg">Filters</span>
                            <button
                                onClick={() => setIsFilterDrawerOpen(false)}
                                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                                aria-label="Close filters"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>
                        {/* Drawer body — scrollable */}
                        <div className="flex-1 overflow-y-auto p-4 font-satoshi-regular">
                            <AccordionSideBar setInput={setInput} activeFilters={activeFilters} allTopics={allTopics} allTechnologies={allTechnologies} allYears={allYears} setActiveFilters={setActiveFilters} setYear={setYear} allOrgs={allOrgs} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
