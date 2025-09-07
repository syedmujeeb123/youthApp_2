import { useState, useEffect } from "react";
import {
  Users,
  Award,
  BookOpen,
  Code,
  Heart,
  Mail,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "../UI/reusable/BackTo";

function About() {
  const [activeTab, setActiveTab] = useState("story");
  const [isVisible, setIsVisible] = useState(false);
  const [skills] = useState([
    { name: "Qur'an Understanding", level: 95 },
    { name: "Tafsir & Hadith", level: 90 },
    { name: "Fiqh Basics", level: 85 },
    { name: "Akhlaq (Character)", level: 100 },
    { name: "Akhirah Reminders", level: 100 },
  ]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teamMembers = [
    {
      name: "Ustadh Ameen",
      role: "Islamic Mentor",
      image: "/images/ustadh1.jpg",
    },
    {
      name: "Sr. Fatima",
      role: "Qur'an Teacher",
      image: "/images/teacher2.jpg",
    },
    {
      name: "Br. Abdullah",
      role: "Youth Guide",
      image: "/images/teacher3.jpg",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <BackButton label="Go Back" />
      <div className="max-w-6xl mx-auto mb-16">
        {/* Hero */}
        <div className="text-center py-16">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            About Our Mission
          </h1>
          <p className="text-xl text-blue-900 max-w-3xl mx-auto">
            We are a humble team striving to guide souls toward the light of
            Islam — by sharing knowledge, nurturing faith, and reminding one
            another about the journey to Akhirah.
          </p>
        </div>

        {/* Animated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Users size={48} className="text-blue-500" />,
              title: "Our Ummah",
              desc: "Dedicated believers working together to spread beneficial knowledge and Islamic values.",
            },
            {
              icon: <Award size={48} className="text-purple-500" />,
              title: "Our Purpose",
              desc: "To please Allah ﷻ by guiding others to righteousness and preparing for the Hereafter.",
            },
            {
              icon: <Heart size={48} className="text-pink-500" />,
              title: "Our Values",
              desc: "Ikhlas (sincerity), Taqwa (God-consciousness), and the Sunnah of our beloved Prophet ﷺ.",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all"
            >
              <div className="flex justify-center mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold text-center mb-2 text-blue-900">
                {card.title}
              </h3>
              <p className="text-center text-blue-800">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-16">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["story", "skills", "team"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-blue-500 text-white font-bold"
                    : "bg-blue-100 hover:bg-blue-200 text-blue-800"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="transition-all duration-500">
            {activeTab === "story" && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-2xl font-bold text-blue-600">
                  Our Journey
                </h3>
                <p className="text-blue-800">
                  This initiative was started in 2018 with the intention of
                  seeking Allah’s pleasure by spreading authentic Islamic
                  teachings. Since then, we have been working to educate hearts
                  and minds with reminders about the purpose of life, the value
                  of knowledge, and the eternal destination — the Akhirah.
                </p>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-2xl font-bold text-purple-600">
                  What We Teach
                </h3>

                <div className="space-y-6">
                  {skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-blue-900">
                        <span className="font-medium">{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div className="animate-fadeIn">
                <h3 className="text-2xl font-bold text-pink-600 mb-8">
                  Meet Our Teachers
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-6 bg-pink-100 rounded-lg hover:bg-pink-200 transition-all"
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-xl font-bold text-pink-800">
                        {member.name}
                      </h4>
                      <p className="text-pink-700">{member.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            {
              label: "Students Benefited",
              value: "1000+",
              icon: <Users className="text-blue-600" />,
            },
            {
              label: "Islamic Sessions",
              value: "500+",
              icon: <BookOpen className="text-purple-600" />,
            },
            {
              label: "Duas Memorized",
              value: "200+",
              icon: <Heart className="text-pink-600" />,
            },
            {
              label: "Years in Dawah",
              value: "7",
              icon: <Award className="text-green-600" />,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow"
            >
              <div className="mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-blue-800 mb-1">
                {stat.value}
              </div>
              <div className="text-blue-700">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-blue-700">
            Get In Touch
          </h3>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 bg-blue-100 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 bg-blue-100 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
                <textarea
                  rows="4"
                  placeholder="Your Message"
                  className="w-full p-3 bg-blue-100 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                ></textarea>
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity w-full">
                  Send Message
                </button>
              </form>
            </div>
            <div className="md:w-1/2 flex flex-col justify-center space-y-6">
              <div className="flex items-center space-x-4">
                <Mail size={24} className="text-blue-500" />
                <div>
                  <h4 className="font-medium text-blue-800">Email Us</h4>
                  <p className="text-blue-700">contact@yourcompany.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Users size={24} className="text-purple-500" />
                <div>
                  <h4 className="font-medium text-blue-800">Visit Us</h4>
                  <p className="text-blue-700">
                    123 Innovation Street, Tech City
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <h4 className="font-medium mb-4 text-blue-800">Follow Us</h4>
                <div className="flex space-x-4">
                  {[Twitter, Linkedin, Github].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="bg-blue-100 p-3 rounded-full hover:bg-blue-200"
                    >
                      <Icon size={20} className="text-blue-600" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-blue-700 border-t border-blue-200">
          <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default About;
