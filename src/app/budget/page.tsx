import supabase from "@/utils/supabase";

export default async function Budget() {
  const { data: transactionRecords } = await supabase
    .from("transactionRecords")
    .select("id, date, transactionDescription, withdrawals, deposits, balance");

  if (!transactionRecords) {
    return <p>No posts found.</p>;
  }
  return (
    <div className="p-8">
      {transactionRecords.map((tr) => (
        <div
          key={tr.id}
          className="grid grid-cols-5 gap-4 items-center p-4 bg-slate-600"
        >
          <div>{tr.date}</div>
          <div>{tr.transactionDescription}</div>
          <div>{tr.withdrawals}</div>
          <div>{tr.deposits}</div>
          <div>{tr.balance}</div>
        </div>
      ))}
    </div>
  );
}
