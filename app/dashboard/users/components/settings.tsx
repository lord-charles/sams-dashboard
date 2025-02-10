import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const SettingsComponent = () => {
  return (
    <div>
      {" "}
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Manage global settings for the user management system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password-policy">Password Policy</Label>
            <Select defaultValue="medium">
              <SelectTrigger id="password-policy">
                <SelectValue placeholder="Select password policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Security</SelectItem>
                <SelectItem value="medium">Medium Security</SelectItem>
                <SelectItem value="high">High Security</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
            <Input id="session-timeout" type="number" defaultValue={30} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="failed-attempts">Max Failed Login Attempts</Label>
            <Input id="failed-attempts" type="number" defaultValue={5} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="two-factor" />
            <Label htmlFor="two-factor">
              Enforce Two-Factor Authentication
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Data Retention Policy</Label>
            <Textarea placeholder="Describe your data retention policy here..." />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsComponent;
