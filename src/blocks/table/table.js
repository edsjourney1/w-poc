function buildCell(rowIndex, columnIndex, isHeader, rowSpan, colSpan) {
  const cell = isHeader ? document.createElement('th') : document.createElement('td');
  if (isHeader) cell.setAttribute('scope', 'col');
  cell.setAttribute('aria-rowindex', rowIndex + 1);
  cell.setAttribute('aria-colindex', columnIndex + 1);
  if (rowSpan >= 1) cell.setAttribute('aria-rowspan', rowSpan);
  if (colSpan >= 1) cell.setAttribute('aria-colspan', colSpan);
  cell.setAttribute('role', 'gridcell');
  return cell;
}

export default async function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  // if header class present
  const header = !block.classList.contains('no-header');
  // if footer class present
  const footer = block.classList.contains('table-footer');
  // create tfoot if footer class present
  const tfoot = footer ? document.createElement('tfoot') : null;
  const rowslength = block.children.length;
  if (header) table.append(thead);
  if (footer) table.append(tfoot);
  table.append(tbody);
  [...block.children].forEach((child, i) => {
    const row = document.createElement('tr');
    if (header && i === 0) thead.append(row);
    // if footer present and it's last child, append row(tr) in tfoot
    else if (footer && i === rowslength - 1) tfoot.append(row);
    else tbody.append(row);
    [...child.children].forEach((col, j) => {
      // <tr> ... </tr>
      const isHeaderCell = header && i === 0;
      const rowSpan = col.getAttribute('rowspan') || 1;
      const colSpan = col.getAttribute('colspan') || 1;
      const cell = buildCell(isHeaderCell ? 1 : i, j, isHeaderCell, rowSpan, colSpan);
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });
  block.innerHTML = '';
  block.append(table);
}
