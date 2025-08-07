import React, { useEffect, useState } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { Myasxios } from "@/shared/generics";
import { Skeleton } from "@/components/location/gymPodCard/skeleton";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "tamagui";
interface TimeSlotProps {
  time: string;
  slotsLeft: number;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
}

interface DateSelectorProps {
  selectedDate: Date;
  selectedTime?: string;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
  bookedSessions?: { startTime: string; endTime: string }[];
  daysToShow?: number;
}

// const TimeSlot: React.FC<TimeSlotProps> = ({
//   time,
//   isSelected,
//   isDisabled,
//   onClick,
// }) => (
//   <View className={ `items-center justify-center p-3 rounded-[12px] border transition-colors
//      ${isDisabled
//       ? "bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-50"
//       : isSelected
//         ? "bg-primary text-primary-foreground border-primary"
//         : "bg-card hover:bg-accent border-border"
//     }
//     `}>

//     <Text className={ `font-medium 
//        ${isDisabled
//         ? " text-muted-foreground border border-border cursor-not-allowed opacity-50"
//         : isSelected
//           ? " text-primary-foreground border-primary"
//           : "  border-border"
//       }` }>{ time }</Text>
//   </View>
// );
const TimeSlot: React.FC<TimeSlotProps> = ({
  time,
  isSelected,
  isDisabled,
  onClick,
}) => (
  <Pressable
    onPress={ isDisabled ? undefined : onClick }
    className={ `w-[48.93%] bg-white rounded-[12px] border p-3 items-center justify-center 
      ${isDisabled
        ? "bg-muted text-muted-foreground border-gray-200 opacity-50"
        : isSelected
          ? "!bg-primary text-primary-foreground border-primary"
          : "bg-card hover:bg-accent border-gray-200"
      }`
    }
    disabled={ isDisabled }
  >
    <Text className={ `font-medium text-[16px] 
      ${isDisabled
        ? "text-muted-foreground"
        : isSelected
          ? "text-primary-foreground"
          : ""
      }`
    }>
      { time }
    </Text>
  </Pressable>
);
const TimeSlotLoading = () => (
  <Pressable
    className={ `w-[48%] rounded-[12px] border p-3 items-center justify-center ` }
  >
    <Skeleton className="h-[26px] w-[60%] rounded-[12px]" />
  </Pressable>
);

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  bookedSessions = [],
  daysToShow = 7,
}) => {
  const [formattedTime, setFormattedTime] = useState<Date | null>(null);
  const [loading, setloading] = useState(false);
  useEffect(() => {
    const getTime = async () => {
      setloading(true)
      try {
        // const res = await fetch("https://timeapi.io/api/Time/current/zone?timeZone=Asia%2FTashkent");
        // const data = await res.json();
        // const dateObj = new Date(data.dateTime);
        // setFormattedTime(dateObj);
        // console.log(data.dateTime, "timeorg");
        const ress = await Myasxios.get("/locations/Time");
        const datas = ress.data;
        const tashkentDate = new Date(datas.datetime);
        setFormattedTime(tashkentDate);
      } catch (error) {
        setFormattedTime(new Date())
        console.error("Failed to fetch time:asdasdasdasd", error);
      } finally {
        setloading(false)
      }
    };

    getTime();
  }, []);
  if (formattedTime == null || loading) {
    return (
      <View className="space-y-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={ false }
          contentContainerStyle={ { gap: 3, paddingBottom: 8 } }
          className="flex-row"
        >
          { Array.from({ length: 7 }).map((_, i) => (
            <View
              key={ i }
              className="flex flex-col items-center justify-center   p-2 rounded-[12px] animate-pulse "
            >
              <Skeleton className="w-[60px] h-[60px] rounded-[12px] " />
            </View>
          )) }
        </ScrollView>
        {/* <View className="flex-wrap flex-row gap-2 h-[250px] max-[430px]:h-[17rem] max-[400px]:h-[18rem] max-[356px]:h-[17rem] overflow-y-auto"> */ }
        <View
          // horizontal
          className="flex-row flex-wrap gap-2 h-[250px] overflow-y-auto"
        >
          { Array.from({ length: 8 }).map((_, i) => {
            return (
              <TimeSlotLoading key={ i } />
            );
          }) }
        </View>
        {/* </View> */ }
      </View >
    )
  }
  const currentHour =
    formattedTime.getMinutes() > 10 ? formattedTime.getHours() + 1 : formattedTime.getHours();
  const today = formattedTime;
  const selected = selectedDate;
  selected.setHours(0, 0, 0, 0);
  const isTodaySelected = isSameDay(selected, today);
  const isTooLateToday = formattedTime.getHours() === 23 && formattedTime.getMinutes() > 10;
  const baseDate = isTooLateToday ? addDays(formattedTime, 1) : formattedTime;
  const dates = Array.from({ length: daysToShow }, (_, i) =>
    addDays(baseDate, i)
  );
  const timeSlots = Array.from(
    { length: isTodaySelected ? 24 - currentHour : 24 },
    (_, i) => {
      const hour = isTodaySelected ? currentHour + i : i;
      const slotDate = new Date(selectedDate);
      slotDate.setHours(hour, 0, 0, 0);
      return format(slotDate, "HH:00");
    }
  );
  const bookedTimes = bookedSessions.flatMap((s) => {
    const dateString = s.startTime;
    const [datePart, timePartWithZ] = dateString.split('T');
    const timePart = timePartWithZ.replace('Z', '');
    const finalString = `${datePart} ${timePart}`;
    const dateObj = new Date(finalString);

    const dateStrings = s.endTime;
    const [dateParts, timePartWithZs] = dateStrings.split('T');
    const timeParts = timePartWithZs.replace('Z', '');
    const finalStrings = `${dateParts} ${timeParts}`;
    const dateObjs = new Date(finalStrings);
    const localStart = new Date(dateObj
    );
    const localEnd = new Date(dateObjs);
    if (localEnd <= formattedTime) {
      return [];
    }

    if (
      localStart.getFullYear() !== selectedDate.getFullYear() ||
      localStart.getMonth() !== selectedDate.getMonth() ||
      localStart.getDate() !== selectedDate.getDate()
    ) {
      return [];
    }

    const times: string[] = [];
    const temp = new Date(localStart);
    temp.setMinutes(0, 0, 0);

    while (temp < localEnd) {
      times.push(format(temp, "HH:00"));
      temp.setHours(temp.getHours() + 1);
    }

    return times;
  });

  return (
    <View className="mt-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={ false }
        contentContainerStyle={ { gap: 4, paddingBottom: 8 } }
        className="flex-row"
      >

        { dates.map((date) => {
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selectedDate);
          return (
            <Pressable
              key={ date.toISOString() }
              className={ `
                items-center bg-white justify-center min-w-[60px] p-2 rounded-[12px] transition-colors
                ${isSelected
                  ? "!bg-primary text-primary-foreground"
                  : isToday
                    ? "bg-accent text-accent-foreground"
                    : "bg-card hover:bg-accent"}
                  `}
              onPress={ () => onSelectDate(date) }
            >
              <Text
                className={ ` text-[16px] uppercase 
                ${isSelected
                    ? "text-primary-foreground"
                    : isToday
                      ? " text-accent-foreground"
                      : ""}
                  `}>{ format(date, "EEE") }</Text>
              <Text
                className={ ` text-lg font-semibold
                ${isSelected
                    ? "text-primary-foreground"
                    : isToday
                      ? " text-accent-foreground"
                      : ""}
                  `}
              >{ format(date, "d") }</Text>
            </Pressable>
          );
        }) }
      </ScrollView >
      <ScrollView className="h-[250px]">
        <View className="flex-row flex-wrap gap-2 justify-between">
          { timeSlots.map((time, i) => (
            <TimeSlot
              time={ time }
              key={ i }
              slotsLeft={ 5 }
              isSelected={ selectedTime === time }
              isDisabled={ bookedTimes.includes(time) }
              onClick={ () => onSelectTime(time) }
            />
          )) }
        </View>
      </ScrollView>
    </View >
  );
};

export default DateSelector;
