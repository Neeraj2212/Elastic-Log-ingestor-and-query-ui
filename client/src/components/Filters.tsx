import { isValidTimestamp } from "@/lib/utils";
import { QueryFilterObject } from "@/types";
import axios from "axios";
import { useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";

export default function Filters() {
  const [filters, setFilters] = useState({
    level: "",
    message: "",
    resourceId: "",
    traceId: "",
    spanId: "",
    timestamp: "",
    commit: "",
    parentResourceId: "",
    timeRange: {
      timestampGte: "",
      timestampLte: "",
    },
  });

  const { toast } = useToast();

  const [isTimeRange, setIsTimeRange] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      timeRange: {
        ...prev.timeRange,
        [name]: value,
      },
    }));
  };

  const destructiveToast = (message: string) => {
    toast({
      variant: "destructive",
      description: message,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if time stamp and time range are both valid
    if (
      !isTimeRange &&
      filters.timestamp &&
      !isValidTimestamp(filters.timestamp)
    ) {
      destructiveToast("Invalid timestamp");
      return;
    }

    // Check if isTimeRange is true and both of the time range values is invalid
    if (
      isTimeRange &&
      !isValidTimestamp(filters.timeRange.timestampGte) &&
      !isValidTimestamp(filters.timeRange.timestampLte)
    ) {
      destructiveToast("Invalid time range");
      return;
    }

    const queryObject: QueryFilterObject = {
      level: filters.level,
      message: filters.message,
      resourceId: filters.resourceId,
      traceId: filters.traceId,
      spanId: filters.spanId,
      commit: filters.commit,
      parentResourceId: filters.parentResourceId,
    };

    if (!isTimeRange && filters.timestamp)
      queryObject.timestamp = filters.timestamp;

    if (isTimeRange) {
      queryObject.timeRange = {};
      if (filters.timeRange.timestampGte)
        queryObject.timeRange.timestampGte = filters.timeRange.timestampGte;
      if (filters.timeRange.timestampLte)
        queryObject.timeRange.timestampLte = filters.timeRange.timestampLte;
    }

    const response = await axios
      .post("/api/logs/filter", queryObject)
      .catch((err) => {
        destructiveToast(err.response.data.message);
      });

    if (response?.data) console.log(response.data.data);
  };

  return (
    <div className="bg-secondary px-10 py-10 h-full overflow-y-auto">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Log Filters
      </h2>
      <div className="pt-5">
        <form className="grid gap-y-3" onSubmit={handleSubmit}>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="level" className="font-semibold">
              Level
            </Label>
            <Input
              className="bg-primary-foreground"
              type="level"
              id="level"
              name="level"
              value={filters.level}
              onChange={handleChange}
              placeholder="error"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="message" className="font-semibold">
              Message
            </Label>
            <Input
              className="bg-primary-foreground"
              type="message"
              id="message"
              name="message"
              value={filters.message}
              onChange={handleChange}
              placeholder="message"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="resourceId" className="font-semibold">
              Resource ID
            </Label>
            <Input
              className="bg-primary-foreground"
              type="resourceId"
              id="resourceId"
              name="resourceId"
              value={filters.resourceId}
              onChange={handleChange}
              placeholder="server-1234"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="traceId" className="font-semibold">
              Trace ID
            </Label>
            <Input
              className="bg-primary-foreground"
              type="traceId"
              id="traceId"
              name="traceId"
              value={filters.traceId}
              onChange={handleChange}
              placeholder="abc-xyz-123"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="spanId" className="font-semibold">
              Span ID
            </Label>
            <Input
              className="bg-primary-foreground"
              type="spanId"
              id="spanId"
              name="spanId"
              value={filters.spanId}
              onChange={handleChange}
              placeholder="span-123"
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="commit" className="font-semibold">
              Commit
            </Label>
            <Input
              className="bg-primary-foreground"
              type="commit"
              id="commit"
              name="commit"
              value={filters.commit}
              onChange={handleChange}
              placeholder="5e5e42f"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="parentResourceId" className="font-semibold">
              Parent Resource ID
            </Label>
            <Input
              className="bg-primary-foreground"
              type="parentResourceId"
              id="parentResourceId"
              name="parentResourceId"
              value={filters.parentResourceId}
              onChange={handleChange}
              placeholder="server-1234"
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5 my-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="range-query"
                onClick={() => setIsTimeRange((prev) => !prev)}
              />
              <label
                htmlFor="range-query"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Use Time Range
              </label>
            </div>
          </div>

          {!isTimeRange && (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="timestamp" className="font-semibold">
                Timestamp
              </Label>
              <Input
                className="bg-primary-foreground"
                type="timestamp"
                id="timestamp"
                name="timestamp"
                value={filters.timestamp}
                onChange={handleChange}
                placeholder="YYYY-MM-DDTHH:MM:SS"
              />
            </div>
          )}

          {isTimeRange && (
            <>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="timestampGte" className="font-semibold">
                  Timestamp From
                </Label>
                <Input
                  className="bg-primary-foreground"
                  type="timestampGte"
                  id="timestampGte"
                  name="timestampGte"
                  value={filters.timeRange.timestampGte}
                  onChange={handleTimeRangeChange}
                  placeholder="YYYY-MM-DDTHH:MM:SS"
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="timestampLte" className="font-semibold">
                  Timestamp To
                </Label>
                <Input
                  className="bg-primary-foreground"
                  type="timestampLte"
                  id="timestampLte"
                  name="timestampLte"
                  value={filters.timeRange.timestampLte}
                  onChange={handleTimeRangeChange}
                  placeholder="YYYY-MM-DDTHH:MM:SS"
                />
              </div>
            </>
          )}
          <Button type="submit" variant={"default"}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
