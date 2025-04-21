import * as XLSX from "xlsx";

export function generateExampleSheet(
  columns: { key: string; type: string }[],
  fileName: string = "example_sheet.xlsx"
): void {
  // Generate a header row based on the columns
  const headerRow = columns.map((col) => col.key);
  const typeRow = columns.map((col) => `(${col.type})`);

  // Create worksheet data with header and type rows
  const worksheetData = [headerRow, typeRow];

  // Convert to a worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Example");

  // Write file and trigger download
  XLSX.writeFile(workbook, fileName);
}

export async function importFile<T = any>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;

      // Detect if the file is CSV
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        const workbook = XLSX.read(data, { type: "string" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<T>(sheet); // Convert to array of objects
        resolve(jsonData);
      } else {
        // Handle XLSX/XLS files
        const arrayBuffer = new Uint8Array(data as ArrayBuffer);
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<T>(sheet); // Convert to array of objects
        resolve(jsonData);
      }
    };

    reader.onerror = (error) => reject(error);

    // Read as text for CSV, otherwise as array buffer for XLSX/XLS
    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
}

export function exportFile<T = any>(
  data: T[],
  fileName: string,
  fileType: "xlsx" | "xls" | "csv"
): void {
  const worksheet = XLSX.utils.json_to_sheet(data); // Convert JSON to worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  let bookType: XLSX.BookType;
  switch (fileType) {
    case "xlsx":
      bookType = "xlsx";
      break;
    case "xls":
      bookType = "xls";
      break;
    case "csv":
      bookType = "csv";
      break;
    default:
      bookType = "xlsx";
  }

  XLSX.writeFile(workbook, `${fileName}.${fileType}`, { bookType });
}
