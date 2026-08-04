import { FaGithub, FaLinkedin } from "react-icons/fa6";
import {
  IoMailOutline,
  IoDocumentTextOutline,
  IoGlobeOutline,
} from "react-icons/io5";

import { developerEmail } from "@/config/appConfig";

export const devDescription =
  "Passionate developer and analyst specializing in extracting insights from data, designing FastAPI & React backends, and building interactive, high-performance admin portals.";

export const devSkills = [
  "MERN Stack",
  "Data Analytics",
  "AI & Machine Learning",
];

export const getInTouch = [
  {
    title: "Email Me",
    description: `${developerEmail}`,
    url: `mailto:${developerEmail}`,
    icon: IoMailOutline,
    color: "blue",
  },
  {
    title: "Curriculum Vitae",
    description: `Download Resume (PDF)`,
    url: "#",
    icon: IoDocumentTextOutline,
    color: "emerald",
  },
];

export const devSocials = [
  {
    title: "GitHub",
    url: "https://github.com/Vishnuthangaraj",
    icon: FaGithub,
    color: "black",
  },
  {
    title: "LinkedIn",
    url: "https://www.linkedin.com/in/vishnuthangaraj/",
    icon: FaLinkedin,
    color: "blue",
  },
  {
    title: "Portfolio",
    url: "https://vishnuthangaraj.vercel.app/",
    icon: IoGlobeOutline,
    color: "blue",
  },
];
