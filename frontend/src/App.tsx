
import './App.css'
import { Card } from './components/cardComponent'
import { PopoverDemo } from './components/popOver'

function App() {

  return (
    <>
      <div className='flex gap-4 m-2'>

        <Card orgName="First ORg the the the the the the  of the year" tagline='hello this is out first tagline so you dont know' tags={["hello", "first", "dfd", "sdfdsf", "sdfd", "dfdfsdfdfsdfsdfdsf", "dfd", "sdfsdfsdfdfsdf", "dsfsdfsdf sdf sd f sd f dsf sd f d", "sdfdfdsf ", " sdfsdfsdf ", "sdfdsf"
        ]} />
        <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk' tags={["advanced data structures", "first", "no", "c++", "his is hti new first", "thle"]} />


    
      </div>
    </>
  )
}

export default App
