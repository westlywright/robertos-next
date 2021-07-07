import React from "react";
import UngroupedRow from "./ungrouped-row.js";

const useSubRows = (config = null) => {
  const [subRowConfig, setSubRows] = React.useState(config);

  return { subRowConfig, setSubRows };
};
export default function GroupedRow(props) {
  let showSubRows = false;
  const { group, subHeaders, index } = props;
  const rows = group?.rows ?? [];
  const total = rows.map((r) => r.count).reduce((acc, curr) => acc + curr);
  const rowHasActions = rows.some((row) => row.verify);
  const { subRowConfig, setSubRows } = useSubRows({ showSubRows: false });
  const updateSubRows = () => {
    if (subRowConfig.showSubRows) {
      showSubRows = false;
    } else {
      showSubRows = true;
    }
    return setSubRows({ showSubRows });
  };
  const groupedRow = (
    <tr className="group-row">
      <td>
        <div className="group-tab">{group.ref}</div>
      </td>
      <td>{group.rows.length - 1}</td>
      <td>{total}</td>
      <td>{rowHasActions ? "Yes" : "No"}</td>
      <td onClick={updateSubRows}>
        {subRowConfig.showSubRows ? <span>&#8613;</span> : <span>&#8615;</span>}
      </td>
    </tr>
  );
  const out = [groupedRow];

  if (group.rows.length > 0 && subRowConfig.showSubRows) {
    const neu = (
      <td colSpan="5" className="subrow">
        <table
          className="subtable"
          key={`group-subtable-${group}-${index}`}
        >
          <thead>
            <tr>
              {subHeaders.map((header, index) => (
                <th key={index}>
                  <button type="button">{header.label}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.rows.map((item, index) => (
              <UngroupedRow
                key={index}
                row={item}
                columns={subHeaders}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </td>
    );
    out.push(neu);
  }

  return out;
}
