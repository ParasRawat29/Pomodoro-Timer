
import './App.css';
import Navbar from './components/Navabar/Navbar';
import Timer from './components/Timer/Timer';
import SettingsSidebar from './components/Sidebar/SettingsSidebar'
import Analytics from './components/Analytics/Analytics';

import {useState} from 'react'
function App() {

  const [sidebarIsOpen, setSidebarIsOpen] = useState(0);
  var [sessionVal, setSessionVal] = useState('25');
  var [breakVal, setBreakVal] = useState('2')
  var[active,setActive] = useState("timer");
    
    function handleActiveTab(tabName){
        setActive(()=>tabName)
    }

  function toggleSettingSideBar(){
    setSidebarIsOpen((pre)=>!pre);
  }
  
  return (
     <div class="mainContainer">
       <Navbar 
        toggleSettingSideBar={toggleSettingSideBar}
        active ={active}
        handleActiveTab ={handleActiveTab}

        />
       <div className="contentContainer">
        <div className="mainContent">
            {
              active=="timer" ? 
              <Timer sessionVal={sessionVal} breakVal={breakVal} /> : <Analytics /> 
              }
            
              
          </div>
          <SettingsSidebar 
          toggleSettingSideBar={toggleSettingSideBar}
            sidebarIsOpen={sidebarIsOpen} 
            setSessionVal={setSessionVal} 
            setBreakVal={setBreakVal}
            sessionVal={sessionVal} 
            breakVal={breakVal}
            />
      </div>
      </div>
  );
}

export default App;
