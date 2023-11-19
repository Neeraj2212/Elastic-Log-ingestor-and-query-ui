import { useEffect, useState } from "react";
import "./App.css";
import Filters from "./components/Filters";
import LogTable from "./components/LogTable";
import { TableRowData } from "./types";
import axios from "axios";
import { useToast } from "./components/ui/use-toast";

function App() {
  const [logData, setLogData] = useState<TableRowData[]>([]);
  const { toast } = useToast();

  const fetchRecentLogs = async () => {
    const response = await axios.get("/api/logs").catch((err) => {
      toast({
        variant: "destructive",
        description: err.response.data.message,
      });
    });
    if (response?.data?.data) setLogData(response.data.data);
  };

  useEffect(() => {
    fetchRecentLogs();
  }, []);

  return (
    <>
      <div className="h-screen grid grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Filters setLogData={setLogData} fetchRecentLogs={fetchRecentLogs} />
        </div>
        <div className="lg:col-span-4">
          <div className="px-10 pt-10 pb-5">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Queried Logs
            </h2>
            <p>Recent logs are populated by default</p>
          </div>
          <LogTable tableData={logData} />
        </div>
      </div>
    </>
  );
}

export default App;
