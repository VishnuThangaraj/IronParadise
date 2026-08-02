import { currentYear } from "@/shared/components/layout/footer/hooks/useFooter";

const FooterCopyright = () => {
  return (
    <div className="text-gray-400">
      &copy; {currentYear} All rights reserved.
    </div>
  );
};

export default FooterCopyright;
