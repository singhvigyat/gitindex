
import './App.css'
import { Card } from './components/cardComponent'
import { Tag } from './components/tagComponent'

function App() {

  return (
    <>
    <div className='flex gap-4'>

      <Card orgName="First ORg the the the the the the  of the year" tagline='hello this is out first tagline so you dont know'/>
      <Card orgName='Second ORg of the year' tagline='this is the new stuff enjoynenssdfk'/>
    </div>
      {/* <div className='flex gap-4'>

      <Tag title='hello'/>
      <Tag title='java'/>
      <Tag title='tech'/>
      <Tag title='c++'/>
      </div> */}
    </>
  )
}

export default App
