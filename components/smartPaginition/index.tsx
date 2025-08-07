import React from "react";
import { Pressable, View } from "react-native";
import { Button, XStack, Text } from "tamagui";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

interface SmartPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const SmartPagination: React.FC<SmartPaginationProps> = ({
  page,
  totalPages,
  onChange,
}) => {
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages < 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page >= 1) {
        pages.push(1);
        if (page >= 3) pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  return (
    <XStack space="$2" alignItems="center" justifyContent="center" padding="$2">
      <Button
        size="$3"
        icon={ <ChevronLeft size={ 16 } /> }
        disabled={ page === 1 }
        onPress={ () => {
          if (page > 1) onChange(page - 1);
        } }
      />

      { getPageNumbers().map((p, idx) => (
        <View key={ idx }>
          { p === "..." ? (
            <Text color="$gray10">...</Text>
          ) : (
            <Pressable
              // variant={ p !==/ page ? "outlined" : "outlined" }
              onPress={ () => {
                if (typeof p === "number" && p !== page) {
                  onChange(p);
                }
              } }
              className={ `bg-gray-200  p-2 px-3 rounded-[6px] mx-1 ${p === page && "bg-primary"}` }
            >
              <Text
                className={ ` text-white  ` }
                style={ {
                  color: p === page ? "#D5FA48" : "",
                  fontWeight: "bold"
                } }
              >
                { p }
              </Text>
            </Pressable>
          ) }
        </View>
      )) }

      <Button
        size="$3"
        icon={ <ChevronRight size={ 16 } /> }
        disabled={ page === totalPages }
        onPress={ () => {
          if (page < totalPages) onChange(page + 1);
        } }
      />
    </XStack>
  );
};

export default SmartPagination;
