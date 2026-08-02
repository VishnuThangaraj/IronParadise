import FooterStatus from "./components/FooterStatus";
import FooterCredits from "./components/FooterCredits";
import FooterCopyright from "./components/FooterCopyrights";

const Footer = () => {
  return (
    <div className="w-full py-4 px-6 border-t border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide overflow-hidden transition-colors duration-300">
      <FooterStatus />
      <FooterCopyright />
      <FooterCredits />
    </div>
  );
};

export default Footer;
