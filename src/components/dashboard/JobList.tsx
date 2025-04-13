
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface Job {
  id: number;
  title: string;
  status?: string;
  rate?: string;
}

interface JobListProps {
  title: string;
  jobs: Job[];
  type: "applications" | "available";
}

export const JobList = ({ title, jobs, type }: JobListProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="flex items-center justify-between p-3 bg-white border rounded-md cursor-pointer hover:bg-gray-50"
            >
              <div className="flex flex-col">
                <span className="font-medium">{job.title}</span>
                {type === "applications" && job.status && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 w-fit mt-1">
                    {job.status}
                  </span>
                )}
                {type === "available" && job.rate && (
                  <span className="text-sm text-gray-600 mt-1">{job.rate}</span>
                )}
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
