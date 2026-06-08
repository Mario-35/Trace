
const worksheet = XLSX.utils.json_to_sheet(_DATAS);

// Create a workbook
const workbook = XLSX.utils.book_new();

// Add the worksheet to the workbook
XLSX.utils.book_append_sheet(workbook, worksheet, "echantillons");

// Generate the XLSX file
const xlsx = XLSX.write(workbook, {type: "binary", bookType: "xlsx"});

// write file
XLSX.writeFile(workbook, "echantillons.xlsx", { compression: true });

// go to prev page
window.location.href = history.back();
