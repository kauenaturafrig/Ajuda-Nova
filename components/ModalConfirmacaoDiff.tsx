//components/ModalConfirmacaoDiff.tsx
type Diff = Record<
  string,
  {
    antes: any;
    depois: any;
  }
>;

type Props = {
  open: boolean;
  diff: Diff;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ModalConfirmacaoDiff({
  open,
  diff,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  const campos = Object.keys(diff);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded shadow">
        <h2 className="text-lg font-bold mb-4">
          Confirmar alteração
        </h2>

        <div className="border rounded mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Campo</th>
                <th className="p-2 border">Antes</th>
                <th className="p-2 border">Depois</th>
              </tr>
            </thead>
            <tbody>
              {campos.map((campo) => (
                <tr key={campo}>
                  <td className="p-2 border font-mono">
                    {campo}
                  </td>
                  <td className="p-2 border text-red-600">
                    {String(diff[campo].antes ?? "")}
                  </td>
                  <td className="p-2 border text-green-600">
                    {String(diff[campo].depois ?? "")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
