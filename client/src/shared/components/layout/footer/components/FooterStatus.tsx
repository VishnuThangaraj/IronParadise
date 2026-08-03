export interface FooterStatusProps {
  isOnline: boolean;
}

const FooterStatus = ({ isOnline }: FooterStatusProps) => {
  return (
    <div>
      <span
        className={`rounded-full relateive inline-flex h-2 w-2 me-2 ${isOnline ? "bg-green-500" : "bg-red-500"}`}
      ></span>
      Iron Paradise Admin Portal {isOnline ? "(Online)" : "(Offline)"}
    </div>
  );
};

export default FooterStatus;
