import Tooltip from '@mui/joy/Tooltip';

const year = new Date().getFullYear();

const Footer = () => {
    return (
        <div
            className="text-center py-2 text-sm"
            style={{letterSpacing: "1px"}}
        >
            &copy; {year}{" "}
            <Tooltip title='Click to view my profile' placement="top"
                     size="sm"
                     variant="solid">
            <span
                className="font-semibold cursor-pointer transition-all duration-300 hover:scale-105 hover:text-black animate-pulse"
            >Vishnu Thangaraj</span></Tooltip>
            . All rights reserved.
        </div>
    );
};

export default Footer;
