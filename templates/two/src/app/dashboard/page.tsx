import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import React from "react";

export default function DashboardPage() {
  const breadcrumbItems = [{ label: "Dashboard", href: "/dashboard" }];

  return (
    <div className="container mx-auto px-6 md:px-0 pb-8 ">
      <div className="mb-2">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <main className="flex-1 p-0 md:p-6 pt-0">
        <Tabs defaultValue="overview">
          <div className="flex items-center justify-between">
            <TabsList className="bg-[#2A2A2A] border border-[#424242]">
              <TabsTrigger value="overview" className="text-[#7A7A7A]">
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-[#7A7A7A]">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-[#7A7A7A]">
                Reports
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d] hover:border-[#424242] hover:text-[#7A7A7A] cursor-pointer"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-[#2A2A2A] border border-[#424242]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#A0A0A0]">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#7A7A7A]">
                    $45,231.89
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-[#2A2A2A] border border-[#424242]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#A0A0A0]">
                    Subscriptions
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#7A7A7A]">+2350</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-[#2A2A2A] border border-[#424242]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#A0A0A0]">
                    Sales
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#7A7A7A]">
                    +12,234
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-[#2A2A2A] border border-[#424242]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#A0A0A0]">
                    Active Now
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#7A7A7A]">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="bg-[#2A2A2A] lg:col-span-4 border border-[#424242]">
                <CardHeader>
                  <CardTitle className="font-medium text-[#A0A0A0]">
                    Recent Sales
                  </CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-[#7A7A7A]">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Repudiandae omnis possimus fugiat qui voluptate ratione
                    consequuntur necessitatibus ipsum suscipit optio?
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-[#2A2A2A] lg:col-span-3 border border-[#424242]">
                <CardHeader>
                  <CardTitle className="font-medium text-[#A0A0A0]">
                    Recent Orders
                  </CardTitle>
                  <CardDescription>
                    You received 30 orders this month.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-[#7A7A7A]">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Repudiandae omnis possimus fugiat qui voluptate ratione
                    consequuntur necessitatibus ipsum suscipit optio?
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d] hover:border-[#424242] hover:text-[#7A7A7A] cursor-pointer"
                  >
                    View All Orders
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="bg-[#2A2A2A] lg:col-span-4 border border-[#424242]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="font-medium text-[#A0A0A0]">
                      Performance Overview
                    </CardTitle>
                    <CardDescription>
                      Monthly revenue and user growth
                    </CardDescription>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-[#242424] border border-[#424242] text-[#7A7A7A]"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Last 30 days
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full rounded-md border border-dashed border-[#424242] bg-[#242424] flex items-center justify-center">
                    <div className="flex flex-col items-center text-center">
                      <BarChart3 className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Performance chart visualization
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#2A2A2A] lg:col-span-3 border border-[#424242]">
                <CardHeader>
                  <CardTitle className="font-medium text-[#A0A0A0]">
                    Recent Notifications
                  </CardTitle>
                  <CardDescription>
                    Stay updated with the latest alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Users,
                        color: "text-blue-500",
                        bg: "bg-blue-100",
                        title: "New team member joined",
                        time: "2 hours ago",
                      },
                      {
                        icon: CreditCard,
                        color: "text-green-500",
                        bg: "bg-green-100",
                        title: "Subscription payment successful",
                        time: "5 hours ago",
                      },
                      {
                        icon: ShoppingCart,
                        color: "text-yellow-500",
                        bg: "bg-yellow-100",
                        title: "New order received",
                        time: "1 day ago",
                      },
                      {
                        icon: Package,
                        color: "text-red-500",
                        bg: "bg-red-100",
                        title: "Product out of stock",
                        time: "2 days ago",
                      },
                    ].map((notification, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full ${notification.bg}`}
                        >
                          <notification.icon
                            className={`h-4 w-4 ${notification.color}`}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none text-[#7A7A7A]">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-[#2A2A2A] border border-[#424242]">
                <CardHeader>
                  <CardTitle className="font-medium text-[#A0A0A0]">
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Frequently used tools and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Users, label: "Add User" },
                      { icon: Package, label: "New Product" },
                      { icon: CreditCard, label: "Billing" },
                      { icon: Settings, label: "Settings" },
                    ].map((action, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="h-20 flex-col bg-[#242424] border border-[#424242] text-[#7A7A7A] hover:bg-[#1d1d1d] hover:border-[#424242] hover:text-[#7A7A7A] cursor-pointer"
                      >
                        <action.icon className="mb-2 h-5 w-5" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#2A2A2A] border border-[#424242]">
                <CardHeader>
                  <CardTitle className="font-medium text-[#A0A0A0]">
                    Upcoming Tasks
                  </CardTitle>
                  <CardDescription>
                    Your scheduled tasks for today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Team meeting",
                        time: "10:00 AM",
                        completed: false,
                      },
                      {
                        title: "Project review",
                        time: "1:30 PM",
                        completed: false,
                      },
                      {
                        title: "Client call",
                        time: "3:00 PM",
                        completed: false,
                      },
                      {
                        title: "Update documentation",
                        time: "4:30 PM",
                        completed: true,
                      },
                    ].map((task, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className={`h-5 w-5 rounded-full border ${task.completed ? "bg-primary border-primary" : "border-muted-foreground"} flex items-center justify-center`}
                        >
                          {task.completed && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : "text-[#7A7A7A]"}`}
                          >
                            {task.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {task.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#2A2A2A] border border-[#424242]">
                <CardHeader>
                  <CardTitle className="font-medium text-[#A0A0A0]">
                    Team Activity
                  </CardTitle>
                  <CardDescription>
                    Recent actions from your team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        user: "Alex",
                        action: "created a new project",
                        time: "Just now",
                      },
                      {
                        user: "Sarah",
                        action: "completed 3 tasks",
                        time: "1 hour ago",
                      },
                      {
                        user: "Michael",
                        action: "uploaded new files",
                        time: "3 hours ago",
                      },
                      {
                        user: "Jessica",
                        action: "invited 2 new members",
                        time: "Yesterday",
                      },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {activity.user.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm">
                            <span className="font-medium text-[#7A7A7A]">
                              {activity.user}
                            </span>{" "}
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4 pt-4">
            <Card className="bg-[#2A2A2A] border border-[#424242]">
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  View your analytics data and insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                  Analytics charts will appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4 pt-4">
            <Card className="bg-[#2A2A2A] border border-[#424242]">
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  View and download your reports.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                  Reports will appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
