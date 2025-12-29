const year = new Date().getFullYear();

const Footer = () => {
  return (
    <div className="text-center py-2 text-sm" style={{ letterSpacing: "1px" }}>
      &copy; {year} <span className="font-semibold">Vishnu Thangaraj.</span> All
      rights reserved.
    </div>
  );
};

export default Footer;
