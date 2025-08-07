import { useState } from "react";
import {
  format,
  addDays,
  isSameDay,
  addHours,
  startOfDay,
  parseISO,
  formatISO,
  isAfter,
  isBefore,
  startOfWeek,
} from "date-fns";
import { uz, enUS, ru } from "date-fns/locale";
import i18next from "i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

const locales = { en: enUS, ru: ru, uz: uz };
interface props {
  timeSelection: {
    start: string | null;
    end: string | null;
    selectingStart: boolean;
  };
  setTimeSelection: (val: {
    start: string | null;
    end: string | null;
    selectingStart: boolean;
  }) => void;
}
const WeeklyCalendar = ({ timeSelection, setTimeSelection }: props) => {
  const [currentWeekStart, setCurrentWeekStart] = useState<string>(
    formatISO(new Date())
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const lang = (i18next.language || "en") as keyof typeof locales;
  const locale = locales[lang] || enUS;
  const parseDate = (isoString: string) => parseISO(isoString);
  const formatDate = (date: Date, formatStr: string) =>
    format(date, formatStr, { locale });
  const addDaysToISO = (isoString: string, days: number) =>
    formatISO(addDays(parseDate(isoString), days));
  const addHoursToISO = (isoString: string, hours: number) =>
    formatISO(addHours(parseDate(isoString), hours));
  const generateWeekDays = () => {
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDaysToISO(currentWeekStart, i));
    }
    return days;
  };
  const generateTimeSlots = () => {
    if (!selectedDate) return [];
    const slots: string[] = [];
    const startTime = startOfDay(parseDate(selectedDate));
    for (let i = 0; i < 24; i++) {
      slots.push(addHoursToISO(formatISO(startTime), i));
    }
    return slots;
  };

  const handleDateClick = (dayISO: string) => {
    setSelectedDate(dayISO);
    setTimeSelection({ start: null, end: null, selectingStart: true });
  };

  const handleTimeClick = (timeISO: string) => {
    if (timeSelection.selectingStart) {
      setTimeSelection({
        start: timeISO,
        end: null,
        selectingStart: false,
      });
    } else {
      if (isBefore(parseDate(timeISO), parseDate(timeSelection.start!))) {
        setTimeSelection({
          start: timeISO,
          end: timeSelection.start,
          selectingStart: false,
        });
      } else {
        setTimeSelection({
          ...timeSelection,
          end: timeISO,
          selectingStart: true,
        });
      }
    }
  };

  // Haftani oldinga/yana ortga siljitish
  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeekStart(
      addDaysToISO(currentWeekStart, direction === "prev" ? -7 : 7)
    );
    setSelectedDate(null);
    setTimeSelection({ start: null, end: null, selectingStart: true });
  };

  const timeSlots = generateTimeSlots();

  return (
    <View className=" py-4">
      <View className="flex-row justify-between items-center mb-4">
        {/* <button
          onClick={() => navigateWeek("prev")}
          className="p-2 rounded hover:bg-gray-100"
          aria-label="Previous Week"
        >
          &lt;
        </button> */}

        <Text className="font-semibold">
          {/* Hafta davomidagi sana diapazonini locale ga moslab ko‘rsatish */ }
          { formatDate(parseDate(currentWeekStart), "MMM d") } -{ " " }
          { formatDate(addDays(parseDate(currentWeekStart), 6), "MMM d, yyyy") }
        </Text>

        {/* <button
          onClick={() => navigateWeek("next")}
          className="p-2 rounded hover:bg-gray-100"
          aria-label="Next Week"
        >
          &gt;
        </button> */}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={ false }
        contentContainerStyle={ { gap: 5, paddingBottom: 8 } }
        className="flex-row " >
        <View className="flex-row gap-1 mb-2">
          { generateWeekDays().map((dayISO) => {
            const day = parseDate(dayISO);
            return (
              <Pressable
                key={ dayISO }
                onPress={ () => handleDateClick(dayISO) }
                className={ `py-2 w-[45px] rounded-[12px] justify-between   flex-col items-center
                ${selectedDate && isSameDay(day, parseDate(selectedDate))
                    ? "bg-primary"
                    : "hover:bg-gray-100"
                  }` }
              >
                <Text onPress={ () => handleDateClick(dayISO) } className={ `
                ${selectedDate && isSameDay(day, parseDate(selectedDate))
                    ? " text-primary-foreground"
                    : "hover:bg-gray-100"
                  }` }>
                  { formatDate(day, "EEE") }
                </Text>
                <Text className={ `${selectedDate && isSameDay(day, parseDate(selectedDate))
                  ? " text-primary-foreground"
                  : "hover:bg-gray-100"
                  }` }>
                  { formatDate(day, "d") }
                </Text>
              </Pressable>
            );
          }) }
        </View>
      </ScrollView>

      { selectedDate && (
        <View className="mt-1 ">
          <View className="font-medium gap-1 mb-2 flex-row items-center  ">
            <Text className="">
              { formatDate(parseDate(selectedDate), "EEEE, MMMM d") }
            </Text>
            <Text className="ml-3 text-sm font-normal text-gray-500">
              { timeSelection.selectingStart
                ? lang === "uz"
                  ? "Boshlanish vaqtini tanlang"
                  : lang === "ru"
                    ? "Выберите время начала"
                    : "Select start time"
                : lang === "uz"
                  ? "Tugash vaqtini tanlang"
                  : lang === "ru"
                    ? "Выберите время окончания"
                    : "Select end time" }
            </Text>
          </View>
          {/* 
          <View className="grid grid-cols-3 gap-2">
            { timeSlots.map((timeISO) => {
              const time = parseDate(timeISO);
              const isStart = timeISO === timeSelection.start;
              const isEnd = timeISO === timeSelection.end;
              const isInRange =
                timeSelection.start &&
                timeSelection.end &&
                isAfter(time, parseDate(timeSelection.start)) &&
                isBefore(time, parseDate(timeSelection.end));

              return (
                <Pressable
                  key={ timeISO }
                  onPress={ () => handleTimeClick(timeISO) }
                  className={ `p-2 border rounded text-sm
                    ${isStart
                      ? "bg-primary  text-primary-foreground  border-pribg-primary "
                      : isEnd
                        ? "bg-primary/90  text-primary-foreground  border-pribg-primary/90 "
                        : isInRange
                          ? "bg-primary/30  border-pribg-primary/30 "
                          : "hover:bg-gray-50"
                    }` }
                >
                  <Text
                    className={ `p-2 border rounded text-sm
                    ${isStart
                        ? "text-primary-foreground   "
                        : isEnd
                          ? "  text-primary-foreground  "
                          : isInRange
                            ? ""
                            : ""
                      }` }
                  >
                    { formatDate(time, "HH:00") }
                  </Text>
                </Pressable>
              );
            }) }
          </View> */}
          {/* <View className="flex-row flex-wrap gap-2">
            { timeSlots.map((timeISO) => {
              const time = parseDate(timeISO);
              const isStart = timeISO === timeSelection.start;
              const isEnd = timeISO === timeSelection.end;
              const isInRange =
                timeSelection.start &&
                timeSelection.end &&
                isAfter(time, parseDate(timeSelection.start)) &&
                isBefore(time, parseDate(timeSelection.end));

              return (
                <Pressable
                  key={ timeISO }
                  onPress={ () => handleTimeClick(timeISO) }
                  className={ clsx(
                    "w-[30%] p-2 border rounded", // 3 ustun uchun ~30% eni
                    isStart
                      ? "bg-primary text-primary-foreground border-primary"
                      : isEnd
                        ? "bg-primary/90 text-primary-foreground border-primary/90"
                        : isInRange
                          ? "bg-primary/30 border-primary/30"
                          : "bg-white"
                  ) }
                >
                  <Text className="text-center text-sm">
                    { formatDate(time, "HH:00") }
                  </Text>
                </Pressable>
              );
            }) }
          </View> */}
          <View className="flex-row flex-wrap justify-between gap-2">
            { timeSlots.map((timeISO, index) => {
              const time = parseDate(timeISO);
              const isStart = timeISO === timeSelection.start;
              const isEnd = timeISO === timeSelection.end;
              const isInRange =
                timeSelection.start &&
                timeSelection.end &&
                time > parseDate(timeSelection.start) &&
                time < parseDate(timeSelection.end);

              let bgColor = "";
              let borderColor = "border-gray-300";
              let textColor = "text-black";

              if (isStart) {
                bgColor = "!bg-primary";
                borderColor = "!border-primary";
                textColor = "!text-primary-foreground";
              } else if (isEnd) {
                bgColor = "bg-primary/90";
                borderColor = "border-primary/90";
                textColor = "!text-primary-foreground";
              } else if (isInRange) {
                bgColor = "bg-[#e5e7eb]";
                borderColor = "border-primary/30";
              }

              return (
                <Pressable
                  key={ timeISO }
                  onPress={ () => handleTimeClick(timeISO) }
                  className={ `w-[30%] rounded-[8px]  p-2 border text-center ${bgColor} ${borderColor}` }
                >
                  <Text className={ `text-[14px] text-center ${textColor}` }>
                    { format(time, "HH:00") }
                  </Text>
                </Pressable>
              );
            }) }
          </View>
        </View>
      ) }
    </View>
  );
};

export default WeeklyCalendar;
