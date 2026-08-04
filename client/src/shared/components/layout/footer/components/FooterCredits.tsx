import { useState } from "react";
import { motion } from "motion/react";
import { developerName } from "@/config/appConfig";

import DeveloperCard from "@/shared/components/ui/cards/DeveloperCard";

const FooterCredits = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-1.5 items-center text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
      <span className="whitespace-nowrap">Designed & developed by</span>
      <motion.span
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer transition-colors duration-200 relative group inline-block whitespace-nowrap"
        onClick={() => setOpen(true)}
      >
        {developerName}
        <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
      </motion.span>
      <DeveloperCard open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default FooterCredits;
