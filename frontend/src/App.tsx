
import { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';
import { Dashboard } from './components/dashboard';


function App() {
  let currentYear = new Date().getFullYear()
  currentYear = currentYear - 1; // as we don't have data of currentYear as of now. 

  const [orgs, setOrgs] = useState<object>({});
  const [year, setYear] = useState<number[]>([]);

  interface FilterState {
    years: Number[];
    topics: string[];
    techs: string[];
  }

  const [activeFilters, setActiveFilters] = useState<FilterState>({
    years: [],    // e.g., ["2021", "2022"]
    topics: [],   // e.g., ["web", "education"]
    techs: []     // e.g., ["python", "angular"]
  });

  const [allOrgs, setAllOrgs] = useState({})
  const [allYears, setAllYears] = useState<number[]>([])
  const [allTechnologies, setAllTechnologies] = useState<string[]>([])
  const [allTopics, setAllTopics] = useState<string[]>([])


  const getAllOrgs = async () => {
    // const allOrgs = await axios.get(`${import.meta.env.VITE_URL}/api/org/getAllOrgs`);
    const response = await axios.get(`${import.meta.env.VITE_URL}/api/org/getAllOrgs`);

    // console.log("sdfl sdof dsfodf ds", response.data.allYearsArray)
    const Years = (Object.values(response.data.allYearsArray).map(Number))

    // console.log("hererererer", response.data.allTechnologiesArray)
    const Technologies = (Object.values(response.data.allTechnologiesArray).map(String))
    // console.log("technologies fetched here: ", Technologies)

    const Topics = (Object.values(response.data.allTopicsArray).map(String))
    // console.log("topics are ", Topics)

    const allOrganizations = Object.values(response.data.allOrgsMap).flatMap((y: any) => Object.values(y));


    setAllTechnologies(Technologies)
    setAllTopics(Topics)
    setAllYears(Years)
    setAllOrgs(allOrganizations)

    //@ts-ignore
    console.log((Object.keys(response.data.allOrgsMap).map(Number)))
    //@ts-ignore
    setYear(Object.keys(response.data.allOrgsMap).map(Number));
  }

  // const getOrgsByTopics = async (topic: String) => {
  //   console.log("here in getrogs by topics")

  //   // 1. Flatten: Turn { "2021": { "id1": org1, "id2": org2 } } into [org1, org2]
  //   const allOrganizations = Object.values(allOrgs).flatMap((yearObj: any) =>
  //     Object.values(yearObj)
  //   );

  //   // 2. Filter: Now check each individual organization directly
  //   const selectedOrgs = allOrganizations.filter((org: any) =>
  //     org.topicContent && org.topicContent.includes(topic)
  //   );

  //   console.log("Matching Organizations:", selectedOrgs);
  //   return selectedOrgs;
  // }

  // const getOrgsByTechnologies = async (tech: String) => {
  //   const allOrganizations = Object.values(allOrgs).flatMap((yearObj: any) =>
  //     Object.values(yearObj))


  //   const selectedOrgs = allOrganizations.filter((org: any) =>
  //     org.techContent && org.techContent.includes(tech));


  //   return selectedOrgs;
  // }

  // const getOrgsByYear = async (year: number[]) => {


  //   const selectedOrgs: any = []
  //   console.log("first allorgs are fetched, ", allOrgs)
  //   for (let i = 0; i < year.length; i++) {
  //     //@ts-ignore 
  //     selectedOrgs.push(allOrgs[year[i]]);
  //   }
  //   setOrgs(selectedOrgs)
  //   console.log("after selecting orgs, orgs are -> ", orgs)
  //   // console.log(`orgs after updating are(in app.jsx) : ${orgs}`)

  // }

  useEffect(() => {
    getAllOrgs();
  }, [])

  // useEffect(() => {
  //   console.log("years length is : ", year.length)
  //   // getOrgsByTopics("ds");
  //   // getOrgsByTechnologies("go");

  //   // console.log("years chaneged ", "*--------------------------------------------------")
  //   if (year.length !== 0)
  //     getOrgsByYear(year);
  // }, [year])


  useEffect(() => {
    // Flatten master data into a list of organizations
    const allOrganizations = Object.values(allOrgs);
    // const allOrganizations = allOrgs;

    const filtered = allOrganizations.filter((org: any) => {
      // 1. Year Filter: Check if org's year is in the selected years list
      const yearMatch = activeFilters.years.length === 0 ||
        activeFilters.years.includes(Number(org.year));

      // 2. Topic Filter: Check if org's topics have ANY intersection with selected topics
      const topicMatch = activeFilters.topics.length === 0 ||
        org.topicContent?.some((t: any) => activeFilters.topics.includes(t));

      // 3. Tech Filter: Check if org's tech has ANY intersection with selected tech
      const techMatch = activeFilters.techs.length === 0 ||
        org.techContent?.some((t: any) => activeFilters.techs.includes(t));

      // Return true only if it passes all three category filters
      return yearMatch && topicMatch && techMatch;
    });

    console.log(filtered)

    setOrgs(filtered);
  }, [activeFilters, allOrgs]);


  return (
    <>
      <div className='flex items-center justify-center min-h-screen'>

        <Dashboard setOrgs={setOrgs} activeFilters={activeFilters} setActiveFilters={setActiveFilters} allYears={allYears} orgs={orgs} setYear={setYear} allOrgs={allOrgs} allTechnologies={allTechnologies} allTopics={allTopics} />

      </div>
    </>
  )
}

export default App
