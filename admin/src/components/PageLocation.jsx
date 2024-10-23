import PropTypes from "prop-types";

export const PageLocation = ({ pageTitle, parentPath, currentPath = "" }) => {
  return (
    <div id="pagelocation" className="w-full flex justify-between py-2">
      <div className="text-xl font-bold">{pageTitle}</div>
      <div className="flex items-center text-gray-500">
        <i className="fa-light fa-house me-2 text-black"></i> /{" "}
        <span className="mx-3">{parentPath}</span> /{" "}
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
