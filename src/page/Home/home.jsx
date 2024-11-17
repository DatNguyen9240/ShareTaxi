import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Content from "../../components/Container/Content/Content";
import Where from "../../components/Container/Where/where";
import Discover from "../../components/Container/Discover/discover";
import WhereT from "../../components/Container/whereT/whereT";
import About from "../../components/Container/About/about";
import Footer from "../../components/Footer/footer";
import "./home.css";
import CircularProgress from "@mui/material/CircularProgress";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading by setting a timeout
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="home">
      {loading ? (
        // Show loading spinner when loading is true
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
        // Show main content when loading is false
        <>
          <Header />
          <div className="home__main-content">
            <Content />
            <div className="advertisement">
              <div className="box">
                <div className="icon">🚌</div>
                <div className="title">Your pick of rides at low prices</div>
                <div className="text">
                  No matter where you're going, by bus or carpool, find the
                  perfect ride from our wide range of destinations and routes at
                  low prices.
                </div>
              </div>
              <div className="box">
                <div className="icon">🔒</div>
                <div className="title">Trust who you travel with</div>
                <div className="text">
                  We take the time to get to know each of our members and bus
                  partners. We check reviews, profiles and IDs, so you know who
                  you’re traveling with and can book your ride at ease on our
                  secure platform.
                </div>
              </div>
              <div className="box">
                <div className="icon">⚡</div>
                <div className="title">Scroll, click, tap and go!</div>
                <div className="text">
                  Booking a ride has never been easier! Thanks to our simple app
                  powered by great technology, you can book a ride close to you
                  in just minutes.
                </div>
              </div>
            </div>
            <div className="container">
              <div className="picture">
                <img src="src/assets/Images/scamDetective.svg" alt="Picture" />
              </div>
              <div className="content">
                <h2>Help us keep you safe from scams</h2>
                <p>
                  At BlaBlaCar, we're working hard to make our platform as
                  secure as it can be. But when scams do happen, we want you to
                  know exactly how to avoid and report them. Follow our tips to
                  help us keep you safe.
                </p>
              </div>
            </div>
            <div className="ride-offer-container">
              <div className="content1">
                <h2>Where do you want to drive to?</h2>
                <p>Let's make this your least expensive journey ever.</p>
              </div>
              <div className="image1">
                <img src="src/assets/Images/rideimg.svg" alt="Car ride image" />
              </div>
            </div>
            <div className="where-to-ride">
              <h2>Where do you want a ride to?</h2>
              <p>
                Need a reliable ride between key locations? Our taxi service
                provides quick and comfortable transportation between popular
                spots like Vinhomes, the Vinhomes Cultural Center, and FPT
                University HCM. Designed with students in mind, this service
                offers an affordable, and stress-free way to commute.
              </p>
              <a href="#" className="see-more"></a>
            </div>
            <div className="container2">
              <div className="image-container2">
                <img src="src/assets/Images/bus.svg" alt="BlaBlaCar Bus" />
              </div>
              <div className="text-container2">
                <h2>Our buses take you to school and back for small prices.</h2>
                <p>
                  Every week, every month. To reunite with friends, or to
                  discover new corners of your city. With your school bag, or
                  with just a smile. From home to school, your journey made
                  simple and comfortable.
                </p>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Home;
