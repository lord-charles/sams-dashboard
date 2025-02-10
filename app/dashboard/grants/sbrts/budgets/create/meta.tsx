"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TagsInput } from "@/components/ui/tag-input";
import { useMetaStore } from "@/app/store/meta-store";
import { Button } from "@/components/ui/button";
import { Trash2, Save } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const MetaDataCollection = () => {
  const { toast } = useToast();
  const {
    meta,
    updateClassLevels,
    updateAttendance,
    updateTeachers,
    updateLearners,
    updateClassrooms,
    updateGovernance,
    reset,
  } = useMetaStore();

  const handleReset = () => {
    reset();
    toast({
      title: "Meta Data Reset",
      description: "All meta data has been cleared from local storage.",
    });
  };
  const onSubmit = async () => {
    try {
      console.log("Meta Data:", JSON.stringify(meta, null, 2));
      toast({
        title: "Success",
        description: "Meta data saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save meta data",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>Budget Meta Data</CardTitle>
          <CardDescription>
            Manage your budget&apos;s meta information efficiently
          </CardDescription>
        </div>
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Reset Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Meta Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all school meta data from local
                  storage. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>
                  Reset Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={onSubmit} variant="default">
            <Save className="mr-2 h-4 w-4" />
            Save Meta Data
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="classLevels">Class Levels</Label>
          <TagsInput
            id="classLevels"
            value={meta?.classLevels}
            onValueChange={(values) =>
              updateClassLevels(values?.map((v) => v.toUpperCase()))
            }
            placeholder="Add class levels and press enter..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="latestAttendance">Latest Attendance</Label>
              <Input
                id="latestAttendance"
                type="number"
                value={meta?.latestAttendance}
                onChange={(e) => updateAttendance(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="learnerEstimatedFemale">Estimated Female</Label>
              <Input
                id="learnerEstimatedFemale"
                type="number"
                value={meta?.learners?.estimatedFemale}
                onChange={(e) =>
                  updateLearners({ estimatedFemale: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="learnerEstimatedMale">Estimated Male</Label>
              <Input
                id="learnerEstimatedMale"
                type="number"
                value={meta?.learners?.estimatedMale}
                onChange={(e) =>
                  updateLearners({ estimatedMale: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="learnerEstimatedFemaleDisabled">
                Estimated Female With Disabilities
              </Label>
              <Input
                id="learnerEstimatedFemaleDisabled"
                type="number"
                value={meta?.learners?.estimatedFemaleDisabled}
                onChange={(e) =>
                  updateLearners({
                    estimatedFemaleDisabled: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="learnerEstimatedMaleDisabled">
                Estimated Male With Disabilities
              </Label>
              <Input
                id="learnerEstimatedMaleDisabled"
                type="number"
                value={meta?.learners?.estimatedMaleDisabled}
                onChange={(e) =>
                  updateLearners({
                    estimatedMaleDisabled: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="estimatedFemale">Estimated Female</Label>
              <Input
                id="estimatedFemale"
                type="number"
                value={meta?.teachers?.estimatedFemale}
                onChange={(e) =>
                  updateTeachers({ estimatedFemale: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="estimatedMale">Estimated Male</Label>
              <Input
                id="estimatedMale"
                type="number"
                value={meta?.teachers?.estimatedMale}
                onChange={(e) =>
                  updateTeachers({ estimatedMale: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="estimatedFemaleDisabled">
                Estimated Female With Disabilities
              </Label>
              <Input
                id="estimatedFemaleDisabled"
                type="number"
                value={meta?.teachers?.estimatedFemaleDisabled}
                onChange={(e) =>
                  updateTeachers({
                    estimatedFemaleDisabled: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="estimatedMaleDisabled">
                Estimated Male With Disabilities
              </Label>
              <Input
                id="estimatedMaleDisabled"
                type="number"
                value={meta?.teachers?.estimatedMaleDisabled}
                onChange={(e) =>
                  updateTeachers({
                    estimatedMaleDisabled: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classrooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="permanent">Permanent</Label>
              <Input
                id="permanent"
                type="number"
                value={meta?.classrooms?.permanent}
                onChange={(e) =>
                  updateClassrooms({ permanent: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="temporary">Temporary</Label>
              <Input
                id="temporary"
                type="number"
                value={meta?.classrooms?.temporary}
                onChange={(e) =>
                  updateClassrooms({ temporary: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="openAir">Open Air</Label>
              <Input
                id="openAir"
                type="number"
                value={meta?.classrooms?.openAir}
                onChange={(e) =>
                  updateClassrooms({ openAir: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Governance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="SGB"
                checked={meta?.governance?.SGB}
                onCheckedChange={(checked) =>
                  updateGovernance({ SGB: checked as boolean })
                }
              />
              <Label htmlFor="SGB">SGB</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="SDP"
                checked={meta?.governance?.SDP}
                onCheckedChange={(checked) =>
                  updateGovernance({ SDP: checked as boolean })
                }
              />
              <Label htmlFor="SDP">SDP</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="budgetSubmitted"
                checked={meta?.governance?.budgetSubmitted}
                onCheckedChange={(checked) =>
                  updateGovernance({ budgetSubmitted: checked as boolean })
                }
              />
              <Label htmlFor="budgetSubmitted">Budget Submitted</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bankAccount"
                checked={meta?.governance?.bankAccount}
                onCheckedChange={(checked) =>
                  updateGovernance({ bankAccount: checked as boolean })
                }
              />
              <Label htmlFor="bankAccount">Bank Account</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetaDataCollection;
