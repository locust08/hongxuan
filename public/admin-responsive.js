// Keep wide record/permission tables usable without widening the entire page.
document.querySelectorAll('.admin-content table').forEach(function(table){
 if(table.closest('[data-rich-editor]')||table.closest('[contenteditable]'))return;
 if(!Array.from(table.rows).some(function(row){return row.cells.length>=4;}))return;
 var region=document.createElement('div');region.className='admin-table-scroll';
 region.dataset.tableScroll='';region.tabIndex=0;region.setAttribute('role','region');
 region.setAttribute('aria-label','Scrollable records table');table.before(region);region.append(table);
});
