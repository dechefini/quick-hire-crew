
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Activity {
  id: number;
  status: string;
  title: string;
}

interface ActivityFeedProps {
  title: string;
  activities: Activity[];
}

export const ActivityFeed = ({ title, activities }: ActivityFeedProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="w-14 flex justify-center mr-4">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {activity.status}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.title}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
