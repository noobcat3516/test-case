export function filterUnique(value, row, column) {
    const property = column.property;
    return row[property] === value;
}