
import { useEffect, useState } from 'react';
import './App.css'
// import { Dashboard } from './components/dashboard'
import axios from 'axios';
import { Dashboard } from './components/dashboard';
import { Pagination } from './components/ui/pagination';
import { PaginationComp } from './components/ui/paginationComp';
import AnimatedASCIIBackground from '../../files/(better)rw-ASCII-2';

function App() {
  const [orgs, setOrgs] = useState<object>({});

  async function getOrgs(year: any) {
    const orgs = await axios.get(`${import.meta.env.VITE_URL}/api/org/getOrgs?year=${year}`)
    console.log("orgs are -> ", orgs.data.organizations)
    return orgs.data.organizations;
  }

  useEffect(() => {
    async function get() {
      await getOrgs(2024).then((result) => {
        console.log(result)
        setOrgs(result)
      });
    }

    get();
  }, [])

  return (
    <>
      <div className='flex items-center justify-center min-h-screen'>
        <Dashboard orgs={orgs} />
      
      </div>
    </>
  )
}

export default App
