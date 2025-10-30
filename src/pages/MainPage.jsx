import "../styles/MainPage.css";
import { useNavigate } from "react-router-dom";


export default function StoryBoard() {

  const navigation = useNavigate()
  

  return (
    // Top-level wrapper div
    <div className="container">
        <div className="sidebar">
          <h1>VI Story</h1>
          <div className="nav-links">
            <button onClick={() => navigation("/storyboardpage")}>Draw  Story</button>
            <button onClick={() => navigation("/imagedesign")}> Create  Book</button>
            <button>Connect  Scenes</button>
            <button>Theme Fine</button>
          </div>
          <div className="sidebar-footer">© 2025 VI Story</div>
        </div>
      
      <div className="container-bg1"></div>
      <div className="container-bg2"></div>
      <div className="Centerheart"></div>
      
      {/* === LEFT SIDE DIAGRAM === */}
      <div className="diagram">
        {/* Center heart with title */}
        <div className="center">
          <div className="heart">❤️</div>
          <h1>VI Story</h1>
          <p>
            To visualize your goals, intentions, and aspirations across life
            areas in one inspiring, interactive book.
          </p>
        </div>

        {/* StoryBoarding Section 
          <p>"Plan, visualize, and bring your story to life scene by scene.
                      <p>"Plan, visualize, and bring your story to life scene by scene."</p>
"</p>*/}
          <div className="boxstoryboard">
            <h2 classname="boxstoryboard" onClick={() => navigation("/storyboardpage")}>StoryBoarding</h2>
            <ul>
              <button onClick={() => navigation("/storyboardpage")} className="step1">Think </button>
              <button onClick={() => navigation("/storyboardpage")} className="step2">Write 2</button>
              <button onClick={() => navigation("/storyboardpage")} className="step3">Design</button>
              <button onClick={() => navigation("/storyboardpage")} id="topstep"></button>
            </ul>
          </div>

        {/* Imagine Design Section */}
        <div className="boximagine">
          <h2 className="boximagine" onClick={() => navigation("/imagedesign")}>Imagine <br /> Design</h2>
          <ul>
            <button className="GUY" onClick={() => navigation("/imagedesign")}>Genre</button>
            <button onClick={() => navigation("/imagedesign")} >Title</button>
            <button onClick={() => navigation("/imagedesign")} >Author</button>
          </ul>
        </div>

        {/* Traits & Relates Section */}
        <div className="boxtraits">
          <h2>Traits &<br /> Relates</h2>
          <ul>
            <button className="Emotions">Emotions</button>
            <button className="Morals">Morals</button>
            <button className="ACTIONS">ACTIONS!!</button>
          </ul>
          </div>

        {/* Roles Section */}
        <div className="boxroles">
          <h2>Roles</h2>
          <ul>
            <button className="im">I'm</button>
            <button className="his">His</button>
            <button className="dad">Dad</button>
          </ul>
        </div>
      </div>

      <div className="panel">

       

        {/*
         <div className="card-grid">
          <div className="storycard">
            <h3>Write your story</h3>
            <p>
              Can carry different meanings depending on context. 
              A way of empowerment.
            </p>
            <span>S</span>
          </div>

          <div className="characterscard">
            <h3>Write your characters</h3>
            <p>
              Describe people, roles, or fictional figures. 
              Based on fact or creativity.
            </p>
            <span>C</span>
          </div>

          <div className="scenescard">
            <h3>Write your scenes</h3>
            <p>
              A scene shows a specific moment where something meaningful happens.
            </p>
            <span>S</span>
          </div>

          <div className="settingscard">
            <h3>Write your settings</h3>
            <p>
              A setting is time + place where the story unfolds.
            </p>
            <span>S</span>
          </div>
        </div>

        <h2>What can you do for me?</h2>

        {/* Lower interactive cards 
        <ul className="card-grid">
          <li><button className="MStorycardM"onClick={Panelsubmit}>Make your Story</button></li>
          <li><button className="MCharactercardM"onClick={Panelsubmit}>Make your Character</button></li>
          <li><button className="MScenescardM"onClick={Panelsubmit}>Make your Scenes</button></li>
          <li><button className="MSettingscardM"onClick={Panelsubmit}>Make your Settings</button></li>
        </ul>
        */}
  
      </div>
          </div>
  
      

    
  );
}

