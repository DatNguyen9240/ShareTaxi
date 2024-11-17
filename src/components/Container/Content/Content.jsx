import "./Content.css";
import SearchForm from "../../SearchForm/sForm";
export default function Content() {
  return (
    <div>
      {/* Image Section */}
      <div className="homeImage">
        <img src="src/assets/Images/carpool.svg" alt="Home" />
      </div>
      {/* Search Form Section */}
      <SearchForm></SearchForm>
    </div>
  );
}



