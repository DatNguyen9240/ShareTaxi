import React from "react"
import "./where.css"
export default function where() {
  return (
   
        <div className="where">
        <div className="what">
        <div className="question">Where do you want a ride to?</div>
        <div className="rides">
            <button className="ride-option">London → Manchester</button>
            <button className="ride-option">Manchester → London</button>
            <button className="ride-option">Birmingham → London</button>
        </div>
        <div className="popular-rides">See our most popular rides</div>
        </div>
    </div>
    
  )
}