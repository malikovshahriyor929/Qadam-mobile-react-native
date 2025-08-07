// import { XStack, YStack, Text, Button, Sheet } from 'tamagui'
// import { useTranslation } from 'react-i18next'
// import { useState } from 'react'
// // import WeeklyCalendar from './calendar'

// export function DrawerDialogDemo({
//   open,
//   setOpen,
//   timeSelection,
//   setTimeSelection,
//   refetch,
// }: {
//   open: boolean
//   setOpen: (value: boolean) => void
//   timeSelection: { start: string | null, end: string | null, selectingStart: boolean }
//   setTimeSelection: (val: { start: string | null, end: string | null, selectingStart: boolean }) => void
//   refetch: () => void
// }) {
//   const [position, setPosition] = useState(0)
//   const { t } = useTranslation()
//   console.log(open);

//   return (
//     <Sheet open={ open }
//       onOpenChange={ setOpen }
//       // snapPoints={ [70] }
//       dismissOnSnapToBottom
//       position={ position }
//       onPositionChange={ setPosition }
//       zIndex={ 100_000 }
//       animation="medium"
//     >
//       <YStack padding="$4" gap="$3" bg="$background" h="70%">
//         <Text fontSize="$6" fontWeight="bold">
//           { t('filter') }
//         </Text>

//         {/* <WeeklyCalendar
//           setTimeSelection={setTimeSelection}
//           timeSelection={timeSelection}
//         /> */}

//         <XStack mt="auto" gap="$3">
//           { timeSelection.start && timeSelection.end ? (
//             <Button
//               theme="alt2"
//               flex={ 1 }
//               onPress={ () => {
//                 refetch()
//                 setOpen(false)
//               } }
//             >
//               { t('save') }
//             </Button>
//           ) : (
//             <Button
//               flex={ 1 }
//               onPress={ () => setOpen(false) }
//               theme="alt1"
//               variant="outlined"
//             >
//               { t('bookings.cancel') }
//             </Button>
//           ) }
//         </XStack>
//       </YStack>
//     </Sheet>
//   )
// }

import { XStack, YStack, Text, Button, Sheet } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import WeeklyCalendar from '../calendar';
import { ScrollView } from 'react-native';

interface DrawerDialogDemoProps {
  open: boolean;
  setOpen: (value: boolean) => void;
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
  refetch: () => void;
}

export function DrawerDialogDemo({
  open,
  setOpen,
  timeSelection,
  setTimeSelection,
  refetch,
}: DrawerDialogDemoProps) {
  const [position, setPosition] = useState(0);
  const { t } = useTranslation();

  const handleSave = () => {
    refetch();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Sheet
      open={ open }
      onOpenChange={ setOpen }
      dismissOnSnapToBottom
      // position={ position }
      // onPositionChange={ setPosition }
      // zIndex={ 999999999 }
      forceRemoveScrollEnabled
      modal
      animation="medium"
    >
      <Sheet.Overlay />
      <Sheet.Handle />
      <YStack padding="$4" gap="$3" bg="#fff"  className='bg-gray-300' >
        <ScrollView className='h-full'>
          <Text fontSize="$6" fontWeight="bold">
            { t('filter') }
          </Text>

          {/* Future integration of calendar */ }
          <WeeklyCalendar
            setTimeSelection={ setTimeSelection }
            timeSelection={ timeSelection }
          />

          <XStack marginTop="auto" gap="$3">
            { timeSelection.start && timeSelection.end ? (
              <Button theme="alt2" color={ "#D5FA48" } bg={ "#2A2F35" } flex={ 1 } onPress={ handleSave } >
                { t('save') }
              </Button>
            ) : (
              <Button
                flex={ 1 }
                onPress={ handleCancel }
                theme="alt1"
                borderColor={ "#d1d5db" }
                borderWidth={ 2 }
                variant="outlined"
              >
                { t('bookings.cancel') }
              </Button>
            ) }
          </XStack>
        </ScrollView>
      </YStack>
    </Sheet>
  );
}
