//components/DiffViewer.tsx
type Diff = {
  [campo: string]: {
    antes: any;
    depois: any;
    bloqueado: boolean;
  };
};

export function DiffViewer({ diff }: { diff: Diff }) {
  if (!diff) return null;

  return (
    <div className="border rounded mt-2">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Campo</th>
            <th className="p-2 border">Antes</th>
            <th className="p-2 border">Depois</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(diff).map(([campo, d]) => (
            <tr key={campo}>
              <td className="border p-2 font-mono">{campo}</td>

              <td className="border p-2 bg-red-50">
                {String(d.antes)}
              </td>

              <td className="border p-2 bg-green-50">
                {String(d.depois)}
              </td>

              <td className="border p-2 text-center">
                {d.bloqueado ? (
                  <span className="text-red-600 font-semibold">
                    🔒 Bloqueado
                  </span>
                ) : (
                  <span className="text-green-700 font-semibold">
                    ✔ Reversível
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
