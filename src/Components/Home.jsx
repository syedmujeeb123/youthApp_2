import img1 from "../assets/images/carousel-1-img.jpg";
import img2 from "../assets/images/carousel-2-img.jpg";
import img3 from "../assets/images/carousel-3-img.jpg";
import img4 from "../assets/images/carousel-4-img.jpg";
import img5 from "../assets/images/carousel-5-img.jpg";
import img6 from "../assets/images/carousel-6-img.jpg";
// import Carousel from "../UI/Carousel";
import Layout from "./UI/layout/Layout";
import Carousel from "./UI/nonReusable/Carousel";

const imageList = [img1, img2, img3, img4, img5, img6];

function Home({ toggleNavbar, showNavbar }) {
  return (
    <Layout hiddenNavbar={!showNavbar}>
      <div className="relative">
        <button
          className={`absolute top-28 right-10 pb-1 z-50 border border-gray-400 rounded-full text-white w-8 h-8 flex items-center justify-center text-3xl transition duration-300 ${
            showNavbar ? "bg-green-500" : "bg-transparent border-white"
          }`}
          onClick={toggleNavbar}
        >
          {showNavbar ? "×" : "≡"}
        </button>

        <Carousel images={imageList} />
      </div>
    </Layout>
  );
}

export default Home;
