import i18next from "i18next";

const MembershipName = ({
  name_eng,
  name_ru,
  name_uz,
}: {
  name_eng: string;
  name_ru: string;
  name_uz: string;
}) => {
  const lang = i18next.language;
  if (lang === "uz") return name_uz;
  if (lang === "ru") return name_ru;
  return name_eng;
};

export default MembershipName;
