import React from "react";
import get from "lodash.get";
import UngroupedRow from "./ungrouped-row.js";
import GroupedRow from "./grouped-row.js";

const GROUPED_HEADERS = [
  {
    label: "Entries",
  },
  {
    label: "Total",
  },
  {
    label: "Actions",
  },
  {
    label: "",
  },
];

const useSortedItems = (items, config = null) => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (get(a, sortConfig.key) < get(b, sortConfig.key)) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (get(a, sortConfig.key) > get(b, sortConfig.key)) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    if (!key) {
      return;
    }

    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const useGroupedItems = (groupBy, sortedItems, config = null) => {
  const [groupConfig, setGroupConfig] = React.useState(config);

  const grouped = React.useMemo(() => {
    let groupedItems = [...sortedItems];
    if (groupConfig !== null) {
      if (!groupBy) {
        return [
          {
            key: "default",
            ref: "default",
            showSubRows: false,
            groupedItems,
          },
        ];
      }

      const out = [];
      const map = {};

      for (let i = 0; i < sortedItems.length; i++) {
        const obj = sortedItems[i];
        const key = get(obj, groupBy) || "";
        let entry = map[key];

        if (entry) {
          entry.rows.push(obj);
        } else {
          entry = {
            key,
            ref: key,
            showSubRows: false,
            rows: [obj],
          };
          map[key] = entry;
          out.push(entry);
        }
      }

      return out;
    }
    return groupedItems;
  }, [groupBy, sortedItems, groupConfig]);

  const requestGroup = (event) => {
    setGroupConfig({
      ...groupConfig,
      ...{ groupByEnabled: event.target.checked },
    });
  };

  return { groupedItems: grouped, requestGroup, groupConfig };
};

const useColumns = (headers, groupByConfig = {}, config = null) => {
  const [columnsConfig, setColumns] = React.useState(config);
  const columns = React.useMemo(() => {
    const out = [...headers];

    if (groupByConfig.groupByEnabled && groupByConfig.groupBy) {
      const entry = out.find((x) => x.field === groupByConfig.groupBy);

      if (entry) {
        return [entry, ...GROUPED_HEADERS];
      }
    }

    return out;
  }, [headers, groupByConfig]);

  return { columns };
}

const ucFirst = (string = null) => {
  if (!string) {
    return;
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function Table(props) {
  const groupByLable = ucFirst(props.groupBy);
  const {deafultSortKey = 'date', defaultSortDirection = 'descending' } = props;

  const { items, requestSort, sortConfig } = useSortedItems(
    props.entries,
    {
      key: deafultSortKey,
      direction: defaultSortDirection,
      ...props
    }
  );

  const { groupedItems, requestGroup, groupConfig } = useGroupedItems(
    props.groupBy,
    items,
    { ...props, ...{ groupByEnabled: false } }
  );

  const getClassForSortButton = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const { columns } = useColumns(props.headers, groupConfig);
  const subHeaders = [...props.headers];

  const ungroupedRow = (item, cols, index) => {
    return <UngroupedRow key={index} row={item} columns={cols} index={index} />;
  };

  const groupedRows = (group, index) => {
    return (
      <GroupedRow
        group={group}
        key={`${group}-${index}`}
        subHeaders={subHeaders}
        index={index}
      />
    );
  };

  return (
    <div className="box">
      <div className="grouping">
        <h4>Group By: </h4>
        <label>
          <input
            name="groupBy"
            type="checkbox"
            checked={groupConfig.groupByEnabled}
            onChange={requestGroup}
          />
          {groupByLable}
        </label>
      </div>
      <table className="sortable-table">
        <thead className="header">
          <tr>
            {columns.map((header, index) => (
              <th key={index}>
                <button
                  type="button"
                  className={getClassForSortButton(header.field)}
                  onClick={() => requestSort(header.field)}
                >
                  {header.label}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupConfig.groupByEnabled
            ? groupedItems.map((item, index) => groupedRows(item, index))
            : items.map((item, index) => ungroupedRow(item, columns, index))}
        </tbody>
      </table>
    </div>
  );
}
