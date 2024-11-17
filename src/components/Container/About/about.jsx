import React from "react"
import "./about.css"
export default function about() {
  return (
    <div className="about">
    <div className="containerabout">
        <div className="column">
            <h2>How to travel with BlaBlaCar</h2>
            <p>All carpool routes</p>
            <p>All carpool destinations</p>
            <p>All bus routes</p>
            <p>All bus destinations</p>
        </div>
        <div className="column">
            <h2>Top carpool routes</h2>
            <p>London → Manchester</p>
            <p>Manchester → London</p>
            <p>London → Birmingham</p>
            <p>Birmingham → London</p>
            <p>Leeds → London</p>
            <p>London → Leeds</p>
            <p>Bristol → London</p>
        </div>
        <div className="column">
            <h2>Top bus routes</h2>
            <p>London → Paris</p>
            <p>London → Lille</p>
            <p>London → Brussels</p>
            <p>London → Amsterdam</p>
            <p>London → Roissy CDG Airport</p>
            <p>London → Antwerp</p>
            <p>London → Rotterdam</p>
        </div>
        <div className="column">
            <h2>About</h2>
            <p>How it works</p>
            <p>About Us</p>
            <p>Help Centre</p>
            <p>Press</p>
            <p>We’re Hiring!</p>
            <button className="language-button">Language - English</button>
        </div>
    </div>
    </div>
  )
}