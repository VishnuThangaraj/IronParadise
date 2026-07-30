import { useNavigate } from "react-router-dom";

export const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export const navigateToExternalUrl = (url: string, newTab = false) => {
  if (newTab) {
    openInNewTab(url);
  } else {
    window.location.href = url;
  }
};

export const useNavigation = () => {
  const navigate = useNavigate();

  return {
    navigate,
    openInNewTab,
    navigateToExternalUrl,
  };
};
