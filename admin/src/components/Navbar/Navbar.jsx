import styles from "./Navbar.module.scss";

const Navbar = () => {
  return (
    <div
      className={`${styles.navbar} px-4 flex justify-between border-b-2 border-gray-200 primary-bg`}
    >
      <div className="flex-col lg:flex hidden"></div>
    </div>
  );
};

export default Navbar;
