import { HiMiniExclamationTriangle } from "react-icons/hi2";

import ContactAdminModal from "@/shared/modal/ContactAdminModal";

const LoginAttemptLimitModal = ({
  open,
  maxIncorrectAttempt,
  contactAdmin,
}) => {
  return (
    <ContactAdminModal
      open={open}
      title={"Too Many Login Attempts"}
      onClick={contactAdmin}
    >
      <div className="flex flex-col gap-4 text-sm mt-1 mb-2">
        <div className="text-gray-600 leading-relaxed tracking-wide">
          We have detected more than{" "}
          <span className="font-bold text-gray-800">{maxIncorrectAttempt}</span>{" "}
          failed login attempts on your account.
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <HiMiniExclamationTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

          <p className="text-sm leading-6 text-justify">
            For your security, sign-in is temporarily locked. Please contact the
            administrator or{" "}
            <span className="font-semibold animate-pulse">
              try again in 24 hours
            </span>
            .
          </p>
        </div>
      </div>
    </ContactAdminModal>
  );
};

export default LoginAttemptLimitModal;
