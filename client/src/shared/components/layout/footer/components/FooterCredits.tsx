import { motion } from "motion/react";
import { developerName } from "@/config/appConfig";

const FooterCredits = () => {
  return (
    <div className="flex gap-1 items-center">
      Designed & developed by
      <motion.span
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="font-semibold text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white cursor-pointer transition-colors duration-200 relative group inline-block"
        // onClick={() => setOpen(true)}
      >
        {developerName}
        <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gray-800 dark:bg-gray-200 transition-all duration-300 group-hover:w-full"></span>
      </motion.span>
    </div>
  );
};

export default FooterCredits;
