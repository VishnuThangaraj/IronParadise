const year = new Date().getFullYear();

const FooterCopyright = () => {
  return (
    <div className="text-gray-500">&copy; {year} All rights reserved.</div>
  );
};

export default FooterCopyright;
