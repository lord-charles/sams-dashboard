import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle2, Circle } from "lucide-react";

interface NoTeachersYetProps {
  selectedState: string | null;
  selectedCounty: string | null;
  selectedPayam: string | null;
  selectedSchool: string | null;
}

export function NoTeachersYet({
  selectedState,
  selectedCounty,
  selectedPayam,
  selectedSchool,
}: NoTeachersYetProps) {
  const steps = [
    { name: "State", selected: !!selectedState },
    { name: "County", selected: !!selectedCounty },
    { name: "Payam", selected: !!selectedPayam },
    { name: "School", selected: !!selectedSchool },
  ];

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-center pb-2">
        <Users className="h-12 w-12 text-blue-500 dark:text-blue-400" />
      </CardHeader>
      <CardContent className="text-center">
        <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          No Teachers Yet
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Select a State, County, Payam, and School to view teacher data.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {steps.map((step, index) => (
            <div key={step.name} className="flex items-center">
              {index > 0 && (
                <div className="hidden sm:block w-10 h-0.5 bg-gray-300 dark:bg-gray-600 mx-2" />
              )}
              <div className="flex flex-col items-center">
                {step.selected ? (
                  <CheckCircle2 className="w-8 h-8 text-green-500 dark:text-green-400" />
                ) : (
                  <Circle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                )}
                <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {step.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
