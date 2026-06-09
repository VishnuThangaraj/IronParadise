import { motion } from "motion/react";
import { adminName } from "@/config/appConfig";
import { useState } from "react";

import DeveloperContactModal from "@/shared/components/ui/modal/DeveloperContactModal";

const FooterCredits = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-1.5">
      <span>Designed & developed by</span>
      <motion.span
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="font-semibold text-gray-800 hover:text-black cursor-pointer transition-colors duration-200 relative group inline-block"
        onClick={() => setOpen(true)}
      >
        {adminName}
        <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black transition-all duration-300 group-hover:w-full"></span>
      </motion.span>

      <DeveloperContactModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default FooterCredits;
