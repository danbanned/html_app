import { useState } from "react";

  export function Submittitle() {
    const [click, clicked] = useState("");

    function formisdifferentgetit(e) {
      clicked(e.target.value);
    }

    function densubmitit(e) {
      e.preventDefault();
      alert(`You submitted: ${click}`);
      clicked(""); // clears input
    }

    return (
      <form onSubmit={densubmitit}>
        <label>
          What can I do for you?:
          <input type="text" value={click} onChange={formisdifferentgetit} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }




export function Panelsubmit() {
  const [Pclick, Pclicked] = useState("");

  function formisdifferentgetit(e) {
    Pclicked(e.target.value);
  }

  function densubmitit(e) {
    e.preventDefault();
    alert(`You submitted: ${Pclick}`);
    Pclicked(""); // clears input
  }

  return (
    <form onSubmit={densubmitit}>
      <label>
        Submit panel
        <input type="text" value={Pclick} onChange={formisdifferentgetit} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}




