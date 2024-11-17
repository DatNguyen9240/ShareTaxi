import React from "react"
import "./whereT.css"
export default function whereT() {
  return (
   
        <div className="whereT">
        <div className="whatT">
        <div className="questionT">Where do you want a ride to?</div>
        <div className="ridesT">
            <button className="ride-optionT">London → Manchester</button>
            <button className="ride-optionT">Manchester → London</button>
            <button className="ride-optionT">Birmingham → London</button>
        </div>
        <div className="popular-ridesT">See our most popular rides</div>
        </div>
    </div>
    
  )
}