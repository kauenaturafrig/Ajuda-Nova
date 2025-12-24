//components/ModalDiffAuditoria.tsx
type Diff = Record<
  string,
  {
    antes: any;
    depois: any;
  }
>;

type Props = {
  open: boolean;
  diff: Diff | null;
  auditoriaId?: number;
  onClose: () => void;
  onRollback?: () => void;
};

export default function ModalDiffAuditoria({
  open,
  diff,
  auditoriaId,
  onClose,
  onRollback,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-2xl">
        <h2 className="font-bold mb-4">Diferenças registradas</h2>

        {!diff ? (
          <p>Esta ação não possui diff.</p>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Campo</th>
                <th className="border p-2">Antes</th>
                <th className="border p-2">Depois</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(diff).map(([campo, valores]) => (
                <tr key={campo}>
                  <td className="border p-2 font-mono">{campo}</td>
                  <td className="border p-2 text-red-600">
                    {String(valores.antes ?? "")}
                  </td>
                  <td className="border p-2 text-green-600">
                    {String(valores.depois ?? "")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-between mt-6">
          {auditoriaId && (
            <button
              onClick={onRollback}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Rollback
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
