export const contactColorMap = {
  blue: {
    cardHover: "hover:border-blue-200 hover:bg-blue-50/20",
    iconBg:
      "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    titleHover: "group-hover:text-blue-600",
    arrowHover: "group-hover:text-blue-600",
  },
  emerald: {
    cardHover: "hover:border-emerald-200 hover:bg-emerald-50/20",
    iconBg:
      "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    titleHover: "group-hover:text-emerald-600",
    arrowHover: "group-hover:text-emerald-600",
  },
  purple: {
    cardHover: "hover:border-purple-200 hover:bg-purple-50/20",
    iconBg:
      "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    titleHover: "group-hover:text-purple-600",
    arrowHover: "group-hover:text-purple-600",
  },
};

export const getContactTheme = (item: { color?: string } | any, index: number) => {
  if (item && item.color && item.color in contactColorMap) {
    return contactColorMap[item.color as keyof typeof contactColorMap];
  }

  const themes = [
    contactColorMap.blue,
    contactColorMap.emerald,
    contactColorMap.purple,
  ];
  return themes[index % themes.length];
};

export const socialThemes: Record<string, string> = {
  GitHub:
    "hover:bg-slate-900 hover:text-white hover:border-slate-900 hover:shadow-slate-900/30",
  LinkedIn:
    "hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] hover:shadow-blue-500/30",
  Portfolio:
    "hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-emerald-600/30",
};
