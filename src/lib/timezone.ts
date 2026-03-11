import { Temporal } from "@js-temporal/polyfill";

const WARSAW_TIME_ZONE = "Europe/Warsaw";
const MONTH_PATTERN = /^(\d{4})-(\d{2})$/;

export interface WarsawMonthRange {
  startEpochSeconds: number;
  endEpochSeconds: number;
}

function formatIsoDate(date: Temporal.PlainDate): string {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

export function getWarsawMonthRange(month: string): WarsawMonthRange {
  const monthMatch = MONTH_PATTERN.exec(month);
  if (monthMatch === null) {
    throw new Error(`Invalid month "${month}". Expected YYYY-MM.`);
  }

  const [, yearText, monthText] = monthMatch;
  const start = Temporal.ZonedDateTime.from({
    day: 1,
    hour: 0,
    millisecond: 0,
    minute: 0,
    month: Number(monthText),
    second: 0,
    timeZone: WARSAW_TIME_ZONE,
    year: Number(yearText),
  });
  const end = start.add({ months: 1 });

  return {
    endEpochSeconds: Math.floor(end.epochMilliseconds / 1000),
    startEpochSeconds: Math.floor(start.epochMilliseconds / 1000),
  };
}

export function formatWarsawDate(timestampSeconds: number): string {
  const dateTime = Temporal.Instant.fromEpochMilliseconds(
    timestampSeconds * 1000,
  ).toZonedDateTimeISO(WARSAW_TIME_ZONE);

  return `${dateTime.year}-${String(dateTime.month).padStart(2, "0")}-${String(
    dateTime.day,
  ).padStart(2, "0")}`;
}

export function shiftIsoDate(isoDate: string, days: number): string {
  return formatIsoDate(Temporal.PlainDate.from(isoDate).add({ days }));
}

export function getPreviousWarsawMonth(nowEpochMilliseconds = Date.now()): string {
  const now =
    Temporal.Instant.fromEpochMilliseconds(nowEpochMilliseconds).toZonedDateTimeISO(
      WARSAW_TIME_ZONE,
    );
  const previousMonth = now.subtract({ months: 1 });

  return `${previousMonth.year}-${String(previousMonth.month).padStart(2, "0")}`;
}
