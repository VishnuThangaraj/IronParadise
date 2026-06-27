import { useState } from "react";

import { motion } from "motion/react";
import { adminName } from "@/config/appConfig";

import DeveloperContactModal from "@/shared/components/ui/modal/DeveloperContactModal";

const FooterCredits = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-500">Designed & developed by</span>
      <motion.span
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="group inline-block relative font-semibold text-gray-800 hover:text-black transition-colors duration-200 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        {adminName}
        <span className="bottom-0 left-0 absolute bg-black w-0 group-hover:w-full h-[1.5px] transition-all duration-300"></span>
      </motion.span>

      <DeveloperContactModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default FooterCredits;
