import React from "react"
import "./LearnMore.css"
export default function LearnMore() {
  return (
    <div className="container">
      <div className="text">
        <h2>Help us keep you safe from scams</h2>
        <p>At BlaBlaCar, we're working hard to make our platform as secure as it can be. But when scams do happen, we want you to know exactly how to avoid and report them. Follow our tips to help us keep you safe.</p>
        <button className="button">Learn more</button>
      </div>
      <div className="images">
        <img src="icon1.png" alt="Icon 1" />
        <img src="icon2.png" alt="Icon 2" />
        <img src="icon3.png" alt="Icon 3" />
        <img src="icon4.png" alt="Icon 4" />
      </div>
    </div>
  )
}