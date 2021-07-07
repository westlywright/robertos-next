import startCase from "lodash.startcase";
import Moment from "react-moment";
import get from "lodash.get";
  // react does not seem to like rendering nested paths of objects, not quite sure why?
  // really don't like using a lib for that but thats the reason this exists
export default function Row(props) {
  const { item, idx, column } = props;
  const field = column.field;
  const target = get(item, field);

  if (column?.formatter) {
    // this could be cleaned up to make more general
    if (typeof column.formatter === "function") {
      const out = column.formatter(target);

      return (
        <td key={`${idx}-${field}`} className={`${idx}-${field}`}>
          {out}
        </td>
      );
    }

    if (column.formatter === "date") {
      return (
        <td key={`${idx}-${field}`} className={`${idx}-${field}`}>
          <Moment date={target.toString()} format="MMMM Do, YYYY" />
        </td>
      );
    }
    if (column.formatter === "startCase") {
      return (
        <td key={`${idx}-${field}`} className={`${idx}-${field}`}>
          {startCase(target.toString())}
        </td>
      );
    }
  }

  return (
    <td key={`${idx}-${field}`} className={`${idx}-${field}`}>
      {target.toString()}
    </td>
  );
}
