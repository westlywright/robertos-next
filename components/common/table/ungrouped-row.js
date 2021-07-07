import Row from "./row.js";

export default function UngroupedRow(props) {
  const { columns, index, row } = props;
  return (
    <tr className="main-row">
      {columns.map((column, cindex) => (
        <Row key={cindex} item={row} idx={cindex} column={column} />
      ))}
    </tr>
  );
}
