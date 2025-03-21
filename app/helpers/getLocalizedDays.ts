import { useLanguage } from "../mobx/LanguageStore/LanguageStore";

export default function useLocalizedDays(){
  const {language} = useLanguage();
  const lang = language;
  switch(lang.toLowerCase()) {
    case 'en': default: return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    case 'fr': return ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    case 'ru': return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  }
};