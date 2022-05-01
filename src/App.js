import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './App.css';
import students from './studentInfo'

function App() {
  const [data, setData] = useState(students.students)
  const [searchText, setSearchText] = useState("");
  const [searchTag, setSearchTag] = useState("");
  // let tagsObj = []

  if (document.querySelector(".progress-bar")) {  // get elements for scroll progress bar
    const body = document.body;
    const progressBar = document.querySelector(".progress-bar");

    function stretch() {
      const pixelScrolled = window.scrollY;
      const viewportHeight = window.innerHeight;
      const totalContentHeight = body.scrollHeight;

      // convert pixel to percentage
      const pixelToPerc =
        (pixelScrolled / (totalContentHeight - viewportHeight)) * 100;
      // console.log(pixelToPerc, "pixel");
      // set width to the progress bar
      progressBar.style.width = Math.round(pixelToPerc) + "%";
    }

    // scroll event
    window.addEventListener("scroll", stretch);
  }



  // let click = []
  let url = "https://api.hatchways.io/assessment/students"
  useEffect(() => {
    axios.get(url)
      .then(
        (response) => {
          setData(response.data.students)
        }).catch(
          (error) => {
            console.log(error);
          })
  }, [url])



  function filterBySearchText(i) {
    if (searchText.length === 0) return true;
    if (searchText.length > 0) {
      let fullname = i.firstName + " " + i.lastName
      return JSON.stringify(fullname).toLowerCase().includes(searchText.toLowerCase());
    }
    return false;
  }
  //this should be working, just need to make it for the tags
  function filterBySearchTag(i) {
    if (searchTag.length === 0) return true;
    if (searchTag.length > 0) {
      if (i.tags) {
        return JSON.stringify(i.tags).toLowerCase().includes(searchTag.toLowerCase());
      }
      //need to update the logic here
    }
    return false;
  }

  function setTagText(value, id) {
    // Create a copy using .map()
    let temp = data.map((data) => {
      let tempData = { ...data } // Copy object
      if (data.id === id) {
        if (!tempData.tags) tempData.tags = [value]
        else {
          // console.log("there are previous tags");
          tempData.tags.push(value);
        }
        tempData.tags.sort()
        console.log(tempData.tags);
      }// Set new field
      return tempData
    })

    setData(temp); // Save the copy to state
  }


  function handleClick(idx) {
    // console.log(document.querySelectorAll(".button")[idx].innerHTML);
    if (document.querySelectorAll(".button")[idx].innerHTML === '+') {
      // click[idx] = !click[idx];
      document.querySelectorAll(".hiddenGrades")[idx].style.height = 'auto'
      document.querySelectorAll(".button")[idx].innerHTML = '-'

    } else {
      // click[idx] = !click[idx];
      document.querySelectorAll(".hiddenGrades")[idx].style.height = ''
      document.querySelectorAll(".button")[idx].innerHTML = '+'
    }
  }

  return (
    <div>
      <div class="progress-bar"></div>
      <div className="searchBar">
        <input
          className="search"
          type="search"
          name="search"
          placeholder="Search by name"
          onChange={(e) => { setSearchText(e.target.value); }} />
        <br></br>
        <input
          className="search"
          type="search"
          name="search"
          placeholder="Search by tag"
          onChange={(e) => { setSearchTag(e.target.value); }} />
      </div>
      {/* <hr></hr> */}
      {/* <hr></hr> */}

      <div className="bodyData">
        {/* <header className="App-header"> */}
        {data
          .filter((i) => filterBySearchText(i))
          .filter((i) => filterBySearchTag(i))
          .map((item, idx) => {
            return <div className="studentInfo">
              <div className="image">
                <img className="roboAvatar" src={item.pic} alt="roboAvatar"></img>
              </div>
              <div className="info">

                <div className="button" onClick={() => { handleClick(idx) }}>
                  +
                </div>

                <p>
                  <strong>{item.firstName} {item.lastName}</strong>
                </p>
                <p>Email: {item.email}</p>
                <p>Company: {item.company}</p>
                <p>Skill: {item.skill}</p>
                <p>Average: {(item.grades.reduce((a, b) => parseInt(a) + parseInt(b), 0)) / (item.grades.length) + "%"}</p>

                <div className="hiddenGrades">
                  <br></br>
                  {item.grades.map((grade, idx) => {
                    return <ul className="gradesList">
                      <li>Test {idx + 1}: <span>{grade}%</span></li>
                    </ul>
                  })}
                </div>
                {/* display tag here...
                <hr></hr> */}

                {item.tags && <div className="tagsDisplay">
                  {item.tags.map((item, idx) => {
                    return <span className="tagValue" key={idx}>{item} </span>
                  })}
                </div>}

                {/* input tag here... */}
                <div className="inputTags">
                  <input
                    maxLength="10"
                    className="tagsInput"
                    type="tagsInput"
                    name="tagsInput"
                    placeholder="Add a tag"
                    // onChange={(e) => { setTagText(e.target.value); }} 
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        setTagText(e.target.value, item.id);
                        e.target.value = "";
                      }
                    }}
                  />
                  <br></br>
                </div>
                <hr></hr>

              </div>
            </div>
          })}
        {/* </header> */}
      </div>
    </div>
  );
}

export default App;
