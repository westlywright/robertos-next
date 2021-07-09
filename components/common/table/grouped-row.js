import React from "react";
import UngroupedRow from "./ungrouped-row.js";

const useSubRows = (config = null) => {
  const [subRowConfig, setSubRows] = React.useState(config);

  return { subRowConfig, setSubRows };
};

const useAdditional = (config = null) => {
  const [additionalConfig, setAddtional] = React.useState(config);

  return { additionalConfig, setAddtional };
};

export default function GroupedRow(props) {
  let showSubRows = false;
  const { group, subHeaders, index } = props;
  const rows = group?.rows ?? [];
  const total = rows.map((r) => r.count).reduce((acc, curr) => acc + curr);
  const rowHasActions = rows.some((row) => row.verify);
  const { subRowConfig, setSubRows } = useSubRows({ showSubRows: false });
  const { additionalConfig, setAddtional } = useAdditional({
    showAdditionalEntries: false,
  });

  const updateSubRows = () => {
    if (subRowConfig.showSubRows) {
      showSubRows = false;
    } else {
      showSubRows = true;
    }
    return setSubRows({ showSubRows });
  };

  const updateAdditional = () => {
    let showAdditionalEntries = true;

    if (additionalConfig.showAdditionalEntries) {
      showAdditionalEntries = false;
    }

    console.log(showAdditionalEntries);
    return setAddtional({ showAdditionalEntries });
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
  let groupRows = [...group.rows].slice(0, 9);

  if (additionalConfig.showAdditionalEntries && group.rows.length > 10) {
    groupRows = group.rows;
  }

  if (groupRows.length > 0 && subRowConfig.showSubRows) {
    const neu = (
      <td colSpan="5" className="subrow">
        <table className="subtable" key={`group-subtable-${group}-${index}`}>
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
            {groupRows.map((item, index) => (
              <UngroupedRow
                key={index}
                row={item}
                columns={subHeaders}
                index={index}
              />
            ))}
          </tbody>
        </table>

        {group.rows.length > 10 && (
          <div className="show-more">
            <button type="button" onClick={updateAdditional}>
              {additionalConfig.showAdditionalEntries ? (
                <span>- Show Less</span>
              ) : (
                <span>+ Show All</span>
              )}
            </button>
          </div>
        )}
      </td>
    );
    out.push(neu);
  }

  return out;
}
