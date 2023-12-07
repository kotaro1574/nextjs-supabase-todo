"use client";
import { useState } from "react";
import CSVReader from "./csv-reader";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { useRouter } from "next/navigation";

export default function BudgetCSV() {
  const supabase = createClientComponentClient<Database>();
  const [uploadedList, setUploadedList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUploadCsv = (data: any) => {
    const _formattedData = data
      .map((d: any) => {
        return {
          date: d[0],
          transactionDescription: d[1],
          withdrawals: d[2],
          deposits: d[3],
          balance: d[4],
        };
      })
      .filter((d: any) => d != null);

    setUploadedList(_formattedData);
  };

  const handleOnImport = async () => {
    try {
      setLoading(true);

      const existingData = await supabase
        .from("transactionRecords")
        .select("*");

      const validData: Database["public"]["Tables"]["transactionRecords"]["Row"][] =
        uploadedList
          .map(
            (d: Database["public"]["Tables"]["transactionRecords"]["Row"]) => {
              return {
                ...d,
                withdrawals: d.withdrawals || 0,
                deposits: d.deposits || 0,
                balance: d.balance || 0,
              };
            }
          )
          .filter(
            (d: Database["public"]["Tables"]["transactionRecords"]["Row"]) =>
              d.date && d.transactionDescription
          );

      const newData = validData.filter(
        (newRecord) =>
          !existingData?.data?.some(
            (existingRecord) =>
              existingRecord.date === newRecord.date &&
              existingRecord.transactionDescription ===
                newRecord.transactionDescription
          )
      );

      // 新しいデータのみを挿入
      if (newData.length > 0) {
        await supabase.from("transactionRecords").insert(newData);
      }

      router.push("/budget");
    } catch (e) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div>
        <div className="py-4 text-gray-600 dark:text-white">
          <CSVReader setUploadedData={handleUploadCsv} />
        </div>
        <div className="py-4 text-gray-600 dark:text-white">
          {uploadedList.length > 0 ? (
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      日付
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      取引内容
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      出金
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      預金
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {uploadedList.map((d: any, i: number) => (
                    <tr key={`${d.date}-${d.transactionDescription}-${i}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{d.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {d.transactionDescription}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {d.withdrawals}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {d.deposits}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{d.balance}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
        <div className="flex justify-end">
          <button
            disabled={loading}
            className="flex justify-center bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded mr-1"
            onClick={() => handleOnImport()}
          >
            {loading ? "Loading ..." : "インポート実行"}
          </button>
        </div>
      </div>
    </div>
  );
}
