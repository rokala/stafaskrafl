export function today() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function future(relativeDate, daysAdvance = 7) {
  relativeDate = relativeDate ?? today();
  const nextWeek = new Date(relativeDate);
  nextWeek.setDate(nextWeek.getDate() + daysAdvance);
  return nextWeek;
}