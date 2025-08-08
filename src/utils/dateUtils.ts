export const isHoliday = (date: string, holidayDates: { id: string }[] | undefined): boolean => {
  return holidayDates?.some((holiday) => holiday.id === date) ?? false;
};
