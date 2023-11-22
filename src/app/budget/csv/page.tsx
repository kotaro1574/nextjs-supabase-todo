"use client";
import { useState } from "react";
import CSVReader from "./csv-reader";

export default function BudgetCSV() {
  // CSVファイルの内容を格納する用のstate
  const [uploadedList, setUploadedList] = useState<any>([]);

  //　CSVファイルをアップロードした時の処理
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

  // インポート実行ボタンを押した時の処理
  const handleOnImport = async () => {
    console.log("handleOnImport");
    console.log(uploadedList);

    // バックエンドにデータを送信したり必要な処理を書く
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
                  {uploadedList.map((d: any) => (
                    <tr key={d.date + d.transactionDescription}>
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
            className="flex justify-center bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded mr-1"
            onClick={() => handleOnImport()}
          >
            インポート実行
          </button>
        </div>
      </div>
    </div>
  );
}
