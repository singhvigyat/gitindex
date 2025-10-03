
import { useEffect, useState } from 'react';
import './App.css'
// import { Dashboard } from './components/dashboard'
import axios from 'axios';
import { Dashboard } from './components/dashboard';

function App() {
  const [orgs, setOrgs] = useState<object>({});

  async function getOrgs(year: any) {
    const orgs = await axios.get(`${import.meta.env.VITE_URL}/api/org/getOrgs?year=${year}`)
    console.log("orgs are -> ", orgs.data)
    return orgs;
  }

  useEffect(() => {
    async function get() {
      await getOrgs(2024).then((result) => {
        console.log(result.data)
        setOrgs(result.data)
      });
    }

    get();
  }, [])

  return (

    <>
      <div className='flex gap-4 '>
        
        <Dashboard orgs={orgs}/>
        {/* {
          Object.entries(orgs).map(([_, value]: any) => {
            return Object.entries(value).map(([k, v]: any) => {
              return <div key={k} >{JSON.stringify(v.orgName)}</div>
            })
          
          })
        } */}

      </div>
    </>
  )
}

export default App
