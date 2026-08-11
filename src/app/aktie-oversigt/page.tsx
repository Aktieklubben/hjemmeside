import performanceData from "@/data/performance.json";
import PerformanceChart, {
  type ChartSeriesInput,
} from "@/components/PerformanceChart";
import PerformanceTable from "@/components/PerformanceTable";
import { getMembers } from "@/lib/members.server";

export const metadata = {
  title: "Aktie-oversigt · Aktieklubben",
};

export default function AktieOversigtPage() {
  const { members, indices, periods, generatedAt } = performanceData;
  const rawMembers = getMembers();

  const chartInputs: ChartSeriesInput[] = [
    ...members.map((m) => ({ id: m.id, name: m.name, series: m.series })),
    ...indices.map((idx) => ({
      id: idx.id,
      name: idx.name,
      series: idx.series,
      isIndex: true,
    })),
  ];

  const rows = [...members, ...indices];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Aktie-oversigt</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          Sådan har klubbens porteføljer klaret sig, sammenlignet med hinanden
          og med S&P 500 / OMXC25. Klik på et navn for at redigere
          beholdningen.
        </p>
      </div>

      <PerformanceTable rows={rows} periods={periods} members={rawMembers} />

      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Seneste år (indekseret til 100)
        </h2>
        <PerformanceChart data={chartInputs} />
      </div>

      <p className="text-xs text-neutral-400">
        Data opdateret {new Date(generatedAt).toLocaleString("da-DK")} ·
        Beregnet ud fra manuelt indtastede beholdninger i{" "}
        <code>data/members/</code> og kurser fra Yahoo Finance.
      </p>
    </div>
  );
}
