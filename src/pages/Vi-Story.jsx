import "../styles/MainPage.css";
import { useNavigate } from "react-router-dom";



export default function StoryBoard() {

  const navigation = useNavigate()
  

  return (
    // Top-level wrapper div
    <div className="container">
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

        {/* StoryBoarding Section */}
        <div className="boxstoryboard">
          <h2>StoryBoarding</h2>
          <ul>
            <button className="step1">Step 1</button>
            <button className="step2" >Step 2</button>
            <button className="step3">Steps 3, 4, 5, 6</button>
            <button id="topstep"></button>
          </ul>
         
        </div>

        {/* Imagine Design Section */}
        <div className="boximagine">
          <h2 className="boximagine" onClick={() => navigation("/imagedesign")}>Imagine <br /> Design</h2>
          <p>"Visualize every Verbal <br />
          show us who you are <br /> what you're talking about "</p>
          <ul>
            <button className="GUY" onClick={() => navigation("/imagedesign")}>Draw a guy</button>
            <button className="BOX">Draw a box</button>
            <button className="TREE">Draw a tree</button>
          </ul>
        </div>

        {/* Traits & Relates Section */}
        <div className="boxtraits">
          <h2>Traits &<br /> Relates</h2>
          <p>“My body is my temple. <br /> I honor it with care,<br />
But it keeps having issues </p>
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

      {/* === RIGHT SIDE PANEL === */}
      <div className="panel">
        <h1>Vi Story</h1>
        <button> What can I do for you </button>

        {/* Cards for features */}
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

        {/* Lower interactive cards */}
        <ul className="card-grid">
        </ul>
      </div>
    <div className="body">
      <div classNames="wrap">
        <div className="heart">
          <div className="heart-inner"></div>
        </div>

        <div className="hand left" aria-hidden="true">
          <div className="fingers">
            <div className="finger"></div>
            <div className="finger"></div>
            <div className="finger"></div>
          </div>
        </div>

        <div className="hand right" aria-hidden="true">
          <div className="fingers">
            <div className="finger"></div>
            <div className="finger"></div>
            <div className="finger"></div>
          </div>
        </div>

        <div className="caption">Heart with hands — pure CSS</div>
      </div>
    </div>
      
    </div>

    
  );
}

