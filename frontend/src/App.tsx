
import { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';
import { Dashboard } from './components/dashboard';

function App() {
  let currentYear = new Date().getFullYear()
  currentYear = currentYear - 1; // as we don't have data of currentYear as of now. 

  const [orgs, setOrgs] = useState<object>({});
  const [year, setYear] = useState<number[]>([]);
  const [allOrgs, setAllOrgs] = useState({})

  const getOrgs = async (year: any) => {
    // const orgs = await axios.get(`${import.meta.env.VITE_URL}/api/org/getOrgs?year=${year}`)
    // console.log("orgs are -> ", orgs.data.organizations)
    // return orgs.data.organizations;
    console.log(year);

    // year = year.filter((value: any, index: any, self: any) => {
    //   return self.indexOf(value) === index;
    // });

    const selectedOrgs: any = []
    console.log("first allorgs are fetched, ", allOrgs)
    for (let i = 0; i < year.length; i++) {
      //@ts-ignore 
      selectedOrgs.push(allOrgs[year[i]]);
    }
    console.log("selected orgs are -> ", selectedOrgs)
    return selectedOrgs;

  }

  const getAllOrgs = async () => {
    console.log("to know the order")
    // const allOrgs = await axios.get(`${import.meta.env.VITE_URL}/api/org/getAllOrgs`);
    const response = await axios.get(`${import.meta.env.VITE_URL}/api/org/getAllOrgs`);
    // console.log(response.data.allOrgsMap)

    setAllOrgs(response.data.allOrgsMap)

    setYear([currentYear]);
  }

  const get = async (year: number[]) => {
    console.log("sending req to getOrgs: ", year)
    if (year.length == 0) year.push(currentYear)

    const selectedOrgs = await getOrgs(year)
    setOrgs(selectedOrgs)
    console.log("after selecting orgs, orgs are -> ", orgs)
    // console.log(`orgs after updating are(in app.jsx) : ${orgs}`)

  }

  useEffect(() => {
    getAllOrgs();
  }, [])

  useEffect(() => {
    // if (year.length === 1 && year[0] !== currentYear)
    if (year.length !== 0)
      get(year);
  }, [year])

  return (
    <>
      <div className='flex items-center justify-center min-h-screen'>

        <Dashboard orgs={orgs} setYear={setYear} allOrgs={allOrgs} />

      </div>
    </>
  )
}

export default App
