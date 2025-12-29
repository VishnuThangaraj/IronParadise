import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./Sidebar.module.scss";
import { AdminSidebarItems } from "../../config/SidebarItems";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div
      className={`${styles.sidebar} bg-black rounded-tr-2xl rounded-br-2xl px-5 py-7 flex flex-col`}
    >
      <div className={`${styles.scroller} h-full`}>
        <div className="ms-4 flex gap-7 items-center justify-evenly w-full">
          <img src="images/logo_white.webp" alt="IronParadise" width={80} />
          <span className=" fa-light fa-grid-2 text-right text-white"></span>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-1 justify-between text-white mt-3">
            {AdminSidebarItems.map((section) => (
              <div key={section.section} className="text-left w-full text-sm">
                <div className="mb-3 mt-5 text-sm font-bold">
                  {section.section}
                </div>

                <div className="flex flex-col gap-1">
                  {section.items.map((list) => {
                    const hasChildren = list.childrens?.length > 0;
                    const isActive = location.startsWith(list.location);

                    return (
                      <div key={list.location} className="relative">
                        <div
                          className={`flex items-center p-2 cursor-pointer transition-all duration-300 w-full rounded-xl ${
                            isActive
                              ? "text-white bg-gray-800"
                              : hasChildren
                              ? "text-gray-300 hover:text-white"
                              : "text-gray-300 hover:text-white hover:ps-3 hover:bg-gray-800"
                          }`}
                          onClick={() => {
                            if (hasChildren) {
                              toggleExpand(list.location);
                            } else if (location.slice(1) !== list.location) {
                              setExpanded(null);
                              navigate(`${list.location}`);
                            }
                          }}
                        >
                          <i className={`pe-4 text-sm ${list.icon}`} />
                          <span>{list.name}</span>

                          {hasChildren && (
                            <i
                              className={`ml-auto fa-regular ${
                                expanded === list.location
                                  ? "fa-chevron-down"
                                  : "fa-chevron-right"
                              }`}
                            />
                          )}
                        </div>

                        {hasChildren && expanded === list.location && (
                          <div className="pl-6 relative">
                            <div className="absolute -left-6 top-0 h-full w-0.5 bg-gray-800" />

                            {list.childrens.map((child) => {
                              const isChildActive =
                                location.slice(1) === child.location;

                              return (
                                <div
                                  key={child.location}
                                  className={`p-2 cursor-pointer transition-all duration-300 w-full rounded-xl ${
                                    isChildActive
                                      ? "text-white"
                                      : "text-gray-300 hover:text-white hover:ps-3"
                                  }`}
                                  onClick={() => navigate(`/${child.location}`)}
                                >
                                  <i className="fa-solid fa-caret-right me-2" />
                                  <span>{child.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

{
  /* 

                {AdminSidebarItems.map((list, index) => (
                  <div
                    key={`side-general-${index}`}
                    className={`p-2 cursor-pointer transition-all duration-300 w-full rounded-xl ${
                      location.slice(1).startsWith(list.location)
                        ? "text-white bg-gray-800"
                        : "text-gray-300 hover:text-white hover:ps-3 hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      if (location.slice(1) !== list.location) {
                        // setExpanded(null);
                        navigate(`/${list.location}`);
                      }
                    }}
                  >
                    <i
                      className={`pe-4 text-sm ${list.icon}`}
                      
                    ></i>
                    <span >{list.name}</span>
                  </div>
                ))}
              </div>
            </div> */
}
export default Sidebar;
