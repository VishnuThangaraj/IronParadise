import { useSelector } from "react-redux";

import { motion } from "motion/react";

import FooterStatus from "@/shared/components/layout/footer/components/FooterStatus";
import FooterCredits from "@/shared/components/layout/footer/components/FooterCredits";
import FooterCopyright from "@/shared/components/layout/footer/components/FooterCopyright";

import { selectIsOnline } from "@/shared/redux/serverStatus/serverStatusSelectors";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Footer = () => {
  const isOnline = useSelector(selectIsOnline);

  return (
    <motion.footer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full py-4 px-6 border-t border-gray-100 bg-white/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-gray-500 font-medium tracking-wide overflow-hidden"
    >
      <motion.div variants={childVariants}>
        <FooterStatus isOnline={isOnline} />
      </motion.div>

      <motion.div variants={childVariants}>
        <FooterCopyright />
      </motion.div>

      <motion.div variants={childVariants}>
        <FooterCredits />
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
