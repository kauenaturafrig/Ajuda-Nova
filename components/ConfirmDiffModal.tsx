type Diff = Record<
  string,
  { antes: any; depois: any }
>;

type Props = {
  diff: Diff;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDiffModal({
  diff,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Confirmar alterações</h2>

        <p>
          Você está prestes a alterar os seguintes campos:
        </p>

        <ul>
          {Object.entries(diff).map(([campo, valor]) => (
            <li key={campo}>
              <strong>{campo}</strong>:{" "}
              <span style={{ color: "red" }}>
                {String(valor.antes ?? "-")}
              </span>{" "}
              →{" "}
              <span style={{ color: "green" }}>
                {String(valor.depois ?? "-")}
              </span>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 20 }}>
          <button onClick={onCancel}>Cancelar</button>
          <button
            onClick={onConfirm}
            style={{ marginLeft: 10 }}
          >
            Confirmar e salvar
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal: React.CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 6,
  width: 500,
};
