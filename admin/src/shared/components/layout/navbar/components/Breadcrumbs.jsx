import PropTypes from "prop-types";

const Breadcrumbs = ({ breadcrumbs, navigate }) => {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex items-center gap-1 font-semibold text-[11px] text-slate-400 tracking-wide">
        <span
          className="hover-text-gradient-primary bg-left hover:bg-right cursor-pointer"
          onClick={() => navigate("/")}
        >
          Iron Paradise
        </span>
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-1">
            <span>/</span>
            <span
              onClick={() => navigate(crumb.path)}
              className={`${
                idx === breadcrumbs.length - 1
                  ? "text-gradient-primary-color font-bold"
                  : "cursor-pointer hover-text-gradient-primary bg-left hover:bg-right"
              }`}
            >
              {crumb.name}
            </span>
          </span>
        ))}
      </div>
      <h1 className="mt-0.5 font-montserrat font-bold text-slate-800 text-lg">
        {breadcrumbs[breadcrumbs.length - 1]?.name || "Dashboard"}
      </h1>
    </div>
  );
};

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ).isRequired,
  navigate: PropTypes.func.isRequired,
};

export default Breadcrumbs;
