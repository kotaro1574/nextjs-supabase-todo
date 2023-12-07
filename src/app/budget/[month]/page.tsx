import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function BudgetMonth() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: transactionRecords } = await supabase
    .from("transactionRecords")
    .select("*")
    .ilike("date", "11/%/2023");

  if (!transactionRecords) {
    return <p>No posts found.</p>;
  }

  const totalWithdrawals = transactionRecords
    .reduce((total, record) => {
      if (!record.withdrawals) return total;
      return total + record.withdrawals ?? 0;
    }, 0)
    .toFixed(2);

  const totalDeposits = transactionRecords
    .reduce((total, record) => {
      if (!record.deposits) return total;
      return total + record.deposits ?? 0;
    }, 0)
    .toFixed(2);

  return (
    <div className="p-8">
      <div className="text-gray-600 dark:text-white">
        {transactionRecords.length > 0 ? (
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
                    💸 出金 💸
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    💰 預金 💰
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
                {transactionRecords.map((transactionRecord, i) => (
                  <tr
                    key={`${transactionRecord.date}-${transactionRecord.transactionDescription}-${i}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transactionRecord.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transactionRecord.transactionDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transactionRecord.withdrawals
                          ? `💸 ${transactionRecord.withdrawals}`
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transactionRecord.deposits
                          ? `💰 ${transactionRecord.deposits}`
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transactionRecord.balance}
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">🤑🤑🤑🤑🤑</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">💰💰💰 合計 ☞ </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      😭 {totalWithdrawals}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      😆 {totalDeposits}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">-</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div>no data</div>
        )}
      </div>
    </div>
  );
}
