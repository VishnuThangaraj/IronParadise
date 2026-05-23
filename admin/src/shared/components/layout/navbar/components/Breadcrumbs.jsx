import PropTypes from "prop-types";

const Breadcrumbs = ({ breadcrumbs, navigate }) => {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 tracking-wide">
        <span
          className="cursor-pointer hover:text-indigo-600 transition-colors"
          onClick={() => navigate("/")}
        >
          Iron Paradise
        </span>
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-1">
            <span>/</span>
            <span
              onClick={() => navigate(crumb.path)}
              className={`hover:text-indigo-600 transition-colors ${
                idx === breadcrumbs.length - 1
                  ? "text-indigo-600 font-bold"
                  : "cursor-pointer"
              }`}
            >
              {crumb.name}
            </span>
          </span>
        ))}
      </div>
      <h1 className="text-lg font-bold text-slate-800 font-montserrat mt-0.5">
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
    })
  ).isRequired,
  navigate: PropTypes.func.isRequired,
};

export default Breadcrumbs;
