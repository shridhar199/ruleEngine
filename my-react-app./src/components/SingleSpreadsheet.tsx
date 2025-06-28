import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
// import R{ useContext } from "react";
import Spreadsheet from "react-spreadsheet";
import { canonicalSpreadsheetData } from "../lib/canonicalSpreadsheetData";
import type { SpreadsheetData, SpreadsheetRow } from "../types.ts";
import { PreviewSpreadsheetChanges } from "./PreviewSpreadsheetChanges";
// import { ThemeContext } from "./ThemeProvider";

interface SingleSpreadsheetProps {
  spreadsheet: SpreadsheetData;
  setSpreadsheet: (spreadsheet: SpreadsheetData) => void;
  spreadSheets: SpreadsheetData[];
  selectedSpreadsheetIndex: number;
  setSelectedSpreadsheetIndex: (index: number) => void;
  setSpreadsheets: (spreadsheets: SpreadsheetData[]) => void;
}

const SingleSpreadsheet = ({
  spreadsheet,
  setSpreadsheet,
  spreadSheets,
  selectedSpreadsheetIndex,
  setSelectedSpreadsheetIndex,
//   setSpreadsheets,
}: SingleSpreadsheetProps) => {
//   const { theme, toggleTheme } = useContext(ThemeContext);

  // Make the current spreadsheet readable by Copilot
  useCopilotReadable({
    description: "The current spreadsheet",
    value: spreadsheet,
  });

  // Action: Override spreadsheet content
  useCopilotAction({
    name: "suggestSpreadsheetOverride",
    description: "Suggest an override of the current spreadsheet",
    parameters: [
      {
        name: "rows",
        type: "object[]",
        description: "The rows of the spreadsheet",
        attributes: [
          {
            name: "cells",
            type: "object[]",
            description: "The cells of the row",
            attributes: [
              {
                name: "value",
                type: "string",
                description: "The value of the cell",
              },
            ],
          },
        ],
      },
      {
        name: "title",
        type: "string",
        description: "The title of the spreadsheet",
        required: false,
      },
    ],
    render: (props) => {
      const { rows } = props.args;
      const newRows = canonicalSpreadsheetData(rows);
      return (
        <PreviewSpreadsheetChanges
          preCommitTitle="Replace contents"
          postCommitTitle="Changes committed"
          newRows={newRows}
          commit={(rows) => {
            setSpreadsheet({ ...spreadsheet, rows });
          }}
        />
      );
    },
    handler: () => {}, // No-op (handled in render)
  });

  // Action: Append rows to spreadsheet
  useCopilotAction({
    name: "appendToSpreadsheet",
    description: "Append rows to the current spreadsheet",
    parameters: [
      {
        name: "rows",
        type: "object[]",
        description: "The new rows to append",
        attributes: [
          {
            name: "cells",
            type: "object[]",
            description: "The cells of the row",
            attributes: [
              {
                name: "value",
                type: "string",
                description: "The value of the cell",
              },
            ],
          },
        ],
      },
    ],
    handler: ({ rows }) => {
      const newRows = canonicalSpreadsheetData(rows);
      setSpreadsheet({
        ...spreadsheet,
        rows: [...spreadsheet.rows, ...newRows],
      });
    },
  });

  return (
    <>
      <div className="flex-1 overflow-auto p-5">
        <input
          type="text"
          value={spreadsheet.title}
          className="w-full p-2 mb-5 text-center text-2xl font-bold outline-none bg-transparent"
          onChange={(e) =>
            setSpreadsheet({ ...spreadsheet, title: e.target.value })
          }
        />
        <div className="flex items-start">
          <div style={{ width: "100%" }}>
            <Spreadsheet
              data={spreadsheet.rows}
              onChange={(data) => {
                setSpreadsheet({ ...spreadsheet, rows: data as SpreadsheetRow[] });
              }}
            />
          </div>
          <button
            className="bg-blue-500 text-white rounded-lg w-8 h-8 ml-5"
            onClick={() => {
              // Add an empty column to each row
              const updatedRows = spreadsheet.rows.map((row) => [...row, { value: "" }]);
              setSpreadsheet({ ...spreadsheet, rows: updatedRows });
            }}
          >
            +
          </button>
        </div>
        <button
          className="bg-blue-500 text-white rounded-lg w-8 h-8 mt-5"
          onClick={() => {
            // Add a new empty row
            const newRow = spreadsheet.rows[0].map(() => ({ value: "" }));
            setSpreadsheet({
              ...spreadsheet,
              rows: [...spreadsheet.rows, newRow],
            });
          }}
        >
          +
        </button>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 text-white flex items-center justify-between p-2 shadow-lg">
        <div className="flex space-x-2">
          {spreadSheets.map((sheet, index) => (
            <button
              key={index}
              className={`${
                selectedSpreadsheetIndex === index
                  ? "bg-blue-100 text-blue-600 font-bold"
                  : "bg-gray-100 text-black"
              } px-4 py-2 rounded hover:bg-gray-300 transition`}
              onClick={() => setSelectedSpreadsheetIndex(index)}
            >
              {sheet.title}
            </button>
          ))}
          {/* <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-500 hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button> */}
        </div>
      </div>
    </>
  );
};

export default SingleSpreadsheet;