// pages/api/admin/ramais/[id]/diff.tsx
type Diff = {
  [campo: string]: {
    antes: any;
    depois: any;
  };
};


type Props = {
  diff: Diff;
};

export function DiffPreview({ diff }: Props) {
  const entries = Object.entries(diff);

  if (entries.length === 0) {
    return (
      <p className="text-green-600 font-semibold">
        Nenhuma alteração detectada
      </p>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Campo</th>
            <th className="p-2 text-left">Antes</th>
            <th className="p-2 text-left">Depois</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([campo, { antes, depois }]) => (
            <tr key={campo} className="border-t">
              <td className="p-2 font-medium">{campo}</td>
              <td className="p-2 text-red-700 line-through">
                {String(antes ?? "-")}
              </td>
              <td className="p-2 text-green-700 font-semibold">
                {String(depois ?? "-")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
