import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function BudgetMonth({
  params,
}: {
  params: { month: string };
}) {
  const insertPatternAfterSecondChar = (inputString: string): string => {
    return inputString.slice(0, 2) + "/%/" + inputString.slice(2);
  };
  const month = insertPatternAfterSecondChar(params.month);

  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: transactionRecords } = await supabase
    .from("transactionRecords")
    .select("*")
    .ilike("date", month);

  if (!transactionRecords) {
    return <p>No posts found.</p>;
  }

  const totalWithdrawals = transactionRecords.reduce((total, record) => {
    if (!record.withdrawals) return total;
    return total + record.withdrawals ?? 0;
  }, 0);
  const totalDeposits = transactionRecords.reduce((total, record) => {
    if (!record.deposits) return total;
    return total + record.deposits ?? 0;
  }, 0);

  // 仮のカナダドルから日本円への変換レート
  const exchangeRateCADtoJPY = 106; // 1カナダドル = 90日本円と仮定

  // カナダドルの合計を日本円に変換
  const totalWithdrawalsJPY = totalWithdrawals * exchangeRateCADtoJPY;
  const totalDepositsJPY = totalDeposits * exchangeRateCADtoJPY;

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
                          ? `💸 ${transactionRecord.withdrawals.toLocaleString(
                              "en-CA",
                              { style: "currency", currency: "CAD" }
                            )}`
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transactionRecord.deposits
                          ? `💰 ${transactionRecord.deposits.toLocaleString(
                              "en-CA",
                              { style: "currency", currency: "CAD" }
                            )}`
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transactionRecord.balance
                          ? transactionRecord.balance.toLocaleString("en-CA", {
                              style: "currency",
                              currency: "CAD",
                            })
                          : "-"}
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">🇨🇦🇨🇦🇨🇦</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">💰💰💰 total</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      😭{" "}
                      {totalWithdrawals.toLocaleString("en-CA", {
                        style: "currency",
                        currency: "CAD",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      😆{" "}
                      {totalDeposits.toLocaleString("en-CA", {
                        style: "currency",
                        currency: "CAD",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">-</div>
                  </td>
                </tr>
                <tr className="font-bold">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">🇯🇵🇯🇵🇯🇵</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">💰💰💰 合計</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      😭{" "}
                      {totalWithdrawalsJPY.toLocaleString("ja-JP", {
                        style: "currency",
                        currency: "JPY",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      😆{" "}
                      {totalDepositsJPY.toLocaleString("ja-JP", {
                        style: "currency",
                        currency: "JPY",
                      })}
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
