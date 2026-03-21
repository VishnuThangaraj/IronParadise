import {gsap} from "gsap";
import PropTypes from "prop-types";
import {useEffect, useRef} from "react";

const PageLocation = ({pageTitle, parentPath, currentPath = ""}) => {
    const pageLocation = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const [title, breadcrumb] = pageLocation.current.children;

            gsap.fromTo(
                title,
                {y: 10, opacity: 0, filter: "blur(4px)"},
                {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.5,
                    ease: "power2.out",
                }
            );

            gsap.fromTo(
                breadcrumb,
                {opacity: 0},
                {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out",
                    delay: 0.1,
                }
            );

            const items = breadcrumb.children;

            gsap.fromTo(
                items,
                {x: 12, opacity: 0},
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.45,
                    ease: "power2.out",
                    stagger: 0.06,
                    delay: 0.15,
                }
            );
        }, pageLocation);

        return () => ctx.revert();
    }, []);

    return (
        <div
            id="pagelocation"
            ref={pageLocation}
            className="w-full flex justify-between pb-2"
        >
            <div className="font-bold text-lg">{pageTitle}</div>
            <div className="flex items-center text-gray-500 transition-all duration-200 "><i
                className="fa-duotone fa-solid fa-house-chimney me-2 text-black"></i>
                <span className="mx-2 opacity-70">/</span> <span className="mx-3">{parentPath}</span> <span
                    className="mx-2 opacity-70">/</span>
                <span className="text-black font-semibold ms-2">{currentPath}</span>
            </div>
        </div>
    );
};

PageLocation.propTypes = {
    pageTitle: PropTypes.string.isRequired,
    parentPath: PropTypes.string.isRequired,
    currentPath: PropTypes.string,
};

export default PageLocation;