import {gsap} from "gsap";
import PropTypes from "prop-types";
import {useEffect, useRef} from "react";

const PageLocation = ({pageTitle, parentPath, currentPath = ""}) => {
    const pageLocation = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            pageLocation.current,
            {rotateX: 150, opacity: 0, transformOrigin: "top center"},
            {rotateX: 0, opacity: 1, duration: 0.7, ease: "power2.out"}
        );
    }, []);

    return (
        <div
            id="pagelocation"
            ref={pageLocation}
            className="w-full flex justify-between pb-2"
        >
            <div className="font-bold text-lg">{pageTitle}</div>
            <div className="flex items-center text-gray-500">
                <i className="fa-duotone fa-solid fa-house-chimney me-2 text-black"></i>{" "}
                / <span className="mx-3">{parentPath}</span> /{" "}
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