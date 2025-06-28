import "@copilotkit/react-ui/styles.css"
import { useState, useEffect } from "react"
import SingleSpreadsheet from "../components/SingleSpreadsheet"
import {
  CopilotKit,
  useCopilotAction,
  useCopilotReadable,
  // useCopilotChat
} from "@copilotkit/react-core"
import { CopilotSidebar } from "@copilotkit/react-ui"
import type { SpreadsheetData } from "../types";
import { INSTRUCTIONS } from "../lib/instructions"
import { PreviewSpreadsheetChanges } from "../components/PreviewSpreadsheetChanges"
import { canonicalSpreadsheetData } from "../lib/canonicalSpreadsheetData"
import { copilotkitRuntimeUrl, serverRuleEngineUrl } from "../lib/config"
// import { base_URl } from "./Config"
// import { Bottombar } from "./components/Bottombar";

const CopilotkitSidebar = () => {
  // const base_URl = 'http://localhost:5344/'
  const url = `${copilotkitRuntimeUrl}/copilotkit`
  // const {send } = useCopilotChat() 

  // const handleOpen = ()=>{
  //   const promptMessage = "Show active loans"
  //   send(promptMessage)
  // }

  return (
    <CopilotKit
      runtimeUrl={url}
    //   headers={{
    //     Authorization: `Bearer ${keycloakClient.token}`,
    //   }}
    >
      <CopilotSidebar
        instructions={INSTRUCTIONS}
        labels={{
          title: "Rule Master AI Chatbot",
          initial: "Welcome to the Rule Master AI Chatbot",
        }}
        // defaultOpen={true}
        // clickOutsideToClose={false}
        // messageActions={false} 
        // onSetOpen={handleOpen}
      >

          <Main />
      </CopilotSidebar>
    </CopilotKit>
  );
}

const Main = () => {
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetData[]>([]);
  const [selectedSpreadsheetIndex, setSelectedSpreadsheetIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // const refreshCount = useRulesStore((state) => state.refreshCount);
  // const { triggerRefresh } = useRulesStore();

  useCopilotAction({
    name: "refreshSpreadsheetData",
    description: "Refresh the spreadsheet data after rules are created, updated or deleted. Call this immediately after creating, updating or deleting rules.",
    parameters: [],
    handler: async () => {
      console.log("Refreshing spreadsheet data...");
      // triggerRefresh();
      return { success: true, message: "Spreadsheet data refreshed" };
    },
  });

  useEffect(() => {
    const fetchRulesAndGenerateSheets = async () => {
      try {
            console.log(" Inside fetchRulesAndGenerateSheets of page file")
        const response = await fetch(`${serverRuleEngineUrl}/rules/transformedRules`);
        const rules = await response.json();
        
        // Generate sheets (same logic as SingleSpreadsheet.tsx)
        const rulesSheet: SpreadsheetData = {
          title: "Rules",
          rows: [
            [{ value: "Rule Name" }, { value: "Active" }],
            ...rules.map((rule: any) => [
              { value: rule.name || "" },
              { value: rule.active },
            ]),
          ],
        };

        const eventsSheet = generateEventsSheet(rules);
        const conditionsSheet = generateConditionsSheet(rules);

        setSpreadsheets([rulesSheet, conditionsSheet, eventsSheet]);
      } catch (error) {
        console.error("Failed to fetch rules:", error);
        setSpreadsheets([{
          title: "Error",
          rows: [[{ value: "Failed to load data" }]],
        }]);
      } finally {
        console.log(" Inside finally of page file")
        setIsLoading(false);
      }
    };

    fetchRulesAndGenerateSheets();
  }, []);

const flattenObject = (obj: any, prefix = ""): Record<string, string> => {
  const flattened: Record<string, string> = {};

  // Special handling for conditions array
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      if (typeof item === "object") {
        Object.assign(flattened, flattenObject(item, `${prefix}${index}.`));
      } else {
        flattened[`${prefix}${index}`] = String(item);
      }
    });
    return flattened;
  }

  // Handle regular objects
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      flattened[`${prefix}${key}`] = "";
    } else if (key === "params" && typeof obj[key] === "object") {
      // Special handling for params to merge into parent
      Object.assign(flattened, flattenObject(obj[key], prefix));
    } else if (typeof obj[key] === "object") {
      Object.assign(flattened, flattenObject(obj[key], `${prefix}${key}.`));
    } else {
      flattened[`${prefix}${key}`] = String(obj[key]);
    }
  }
  return flattened;
};

const generateEventsSheet = (rules: any[]): SpreadsheetData => {
  const eventsData = rules.flatMap(rule => {
    if (!rule.event) return [];
    
    const flatEvent = flattenObject(rule.event);
    // Extract value directly if it exists in params
    if (flatEvent["params.value"]) {
      flatEvent.value = flatEvent["params.value"];
      delete flatEvent["params.value"];
    }
    return { "Rule Name": rule.name, ...flatEvent };
  });

  const eventKeys = Array.from(new Set(eventsData.flatMap(Object.keys))).sort();
  return {
    title: "Events",
    rows: [
      eventKeys.map(key => ({ value: key.replace(/\.\d+\./g, '.') })), // Clean array indices
      ...eventsData.map(data => eventKeys.map(key => ({ 
        value: data[key] || "" 
      }))),
    ],
  };
};

const generateConditionsSheet = (rules: any[]): SpreadsheetData => {
  const conditionsData = rules.flatMap(rule => {
    if (!rule.conditions) return [];
    
    const flatConditions = flattenObject(rule.conditions);
    // Transform any.0.x keys to just x
    Object.keys(flatConditions).forEach(key => {
      if (key.startsWith("any.0.")) {
        const newKey = key.replace("any.0.", "");
        flatConditions[newKey] = flatConditions[key];
        delete flatConditions[key];
      }
    });
    return { "Rule Name": rule.name, ...flatConditions };
  });

  const allKeys = Array.from(new Set(conditionsData.flatMap(Object.keys)));
  const conditionKeys = ["Rule Name", ...allKeys.filter(key => key !== 'Rule Name')].sort((a, b) => {

    if (a === 'Rule Name') return -1;
    if (b === 'Rule Name') return 1;
    return a.localeCompare(b);
  });

  return {
    title: "Conditions",
    rows: [
      conditionKeys.map(key => ({ value: key })),
      ...conditionsData.map(data => conditionKeys.map(key => ({ 
        value: data[key] || "" 
      }))),
    ],
  };
};

  useCopilotAction({
    name: "createSpreadsheet",
    description: "Create a new spreadsheet",
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
      },
    ],
    render: (props) => {
      console.log("createSpreadsheet => props: => ", props)
      const { rows, title } = props.args;
      const newRows = canonicalSpreadsheetData(rows);

      return (
        <PreviewSpreadsheetChanges
          preCommitTitle="Create spreadsheet"
          postCommitTitle="Spreadsheet created"
          newRows={newRows}
          commit={(rows) => {
            const newSpreadsheet: SpreadsheetData = {
              title: title || "Untitled Spreadsheet",
              rows: rows,
            };
            setSpreadsheets((prev) => [...prev, newSpreadsheet]);
            setSelectedSpreadsheetIndex(spreadsheets.length);
          }}
        />
      );
    },
    handler: ({ rows, title }) => {
      // Do nothing.
      // The preview component will optionally handle committing the changes.
    },
  });

  // useCopilotChatSuggestions({
  //   instructions: "Provide suggestions for the user like creating a new sheet with sample data, appending rows, telling them about this view. Strictly show only these options at the start of the chat.",
  //   maxSuggestions: 3,
  //   minSuggestions: 1
  // })
  useCopilotReadable({
    description: "Today's date",
    value: new Date().toLocaleDateString(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 text-lg font-medium">
            Loading Rule Spreadsheets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <SingleSpreadsheet
        spreadSheets={spreadsheets}
        selectedSpreadsheetIndex={selectedSpreadsheetIndex}
        setSelectedSpreadsheetIndex={setSelectedSpreadsheetIndex}
        spreadsheet={spreadsheets[selectedSpreadsheetIndex]}
        setSpreadsheet={(updated) => {
          setSpreadsheets(prev => 
            prev.map((sheet, idx) => 
              idx === selectedSpreadsheetIndex ? updated : sheet
            )
          );
        }}
        setSpreadsheets={setSpreadsheets}
      />
    </div>
  );
};

export default CopilotkitSidebar
