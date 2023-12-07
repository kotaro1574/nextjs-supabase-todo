import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Budget() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: newestData, error: newestError } = await supabase
    .from("transactionRecords")
    .select("*")
    .order("date", { ascending: false }) // 日付を降順に
    .limit(1);

  const { data: oldestData, error: oldestError } = await supabase
    .from("transactionRecords")
    .select("*")
    .order("date", { ascending: true }) // 日付を昇順に
    .limit(1);

  const newestRecord = newestData && newestData[0];
  const oldestRecord = oldestData && oldestData[0];

  const getMonthsBetweenDates = (
    startDate: string,
    endDate: string
  ): string[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let months = [];
    for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
      let startMonth = year === start.getFullYear() ? start.getMonth() : 0;
      let endMonth = year === end.getFullYear() ? end.getMonth() : 11;
      for (let month = startMonth; month <= endMonth; month++) {
        // MMを2桁に整形する
        let monthString = (month + 1).toString().padStart(2, "0");
        months.push(`${monthString}/%/${year}`);
      }
    }
    return months;
  };

  const removePattern = (inputString: string): string => {
    return inputString.replace("/%/", "");
  };

  return (
    <div className="p-8">
      <div className="text-gray-600 dark:text-white">
        <ul>
          {getMonthsBetweenDates(
            oldestRecord?.date ?? "",
            newestRecord?.date ?? ""
          ).map((m) => {
            const month = removePattern(m);
            return (
              <li key={month}>
                <Link href={`budget/${month}`}>{month}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
