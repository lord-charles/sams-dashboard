"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface Person {
  name: string;
  email: string;
  phoneNumber: string;
  qualifications: string;
  yearsOfExperience: number;
}

interface Student {
  name: string;
  grade: string;
  age: number;
  specialAchievements: string;
}

interface SchoolData {
  code: string;
  headTeacher: Person;
  deputyHeadTeacher: Person;
  seniorTeachers: Person[];
  headGirl: Student;
  headBoy: Student;
  schoolOfficer: Person;
  parentRepresentatives: {
    female: Person;
    male: Person;
    femaleWithDisability: Person;
    maleWithDisability: Person;
  };
  foundingBody: string;
  lastUpdated: string;
}

const initialData: SchoolData = {
  code: "AKD",
  headTeacher: {
    name: "John Doe",
    email: "john.doe@school.com",
    phoneNumber: "+1234567890",
    qualifications: "Ph.D. in Education, M.Ed.",
    yearsOfExperience: 20,
  },
  deputyHeadTeacher: {
    name: "Jane Smith",
    email: "jane.smith@school.com",
    phoneNumber: "+1234567891",
    qualifications: "M.Ed., B.Sc. in Mathematics",
    yearsOfExperience: 15,
  },
  seniorTeachers: [
    {
      name: "Mike Johnson",
      email: "mike.johnson@school.com",
      phoneNumber: "+1234567892",
      qualifications: "M.Sc. in Physics, B.Ed.",
      yearsOfExperience: 12,
    },
    {
      name: "Sarah Brown",
      email: "sarah.brown@school.com",
      phoneNumber: "+1234567893",
      qualifications: "M.A. in Literature, B.Ed.",
      yearsOfExperience: 10,
    },
  ],
  headGirl: {
    name: "Emily Wilson",
    grade: "12th",
    age: 17,
    specialAchievements: "National Science Olympiad Gold Medalist",
  },
  headBoy: {
    name: "David Thompson",
    grade: "12th",
    age: 18,
    specialAchievements: "School Sports Captain, Regional Debate Champion",
  },
  schoolOfficer: {
    name: "Robert Taylor",
    email: "robert.taylor@school.com",
    phoneNumber: "+1234567894",
    qualifications: "M.B.A., B.Com.",
    yearsOfExperience: 8,
  },
  parentRepresentatives: {
    female: {
      name: "Lisa Davis",
      email: "lisa.davis@email.com",
      phoneNumber: "+1234567895",
      qualifications: "B.Sc. in Psychology",
      yearsOfExperience: 5,
    },
    male: {
      name: "James Green",
      email: "james.green@email.com",
      phoneNumber: "+1234567896",
      qualifications: "M.Sc. in Engineering",
      yearsOfExperience: 7,
    },
    femaleWithDisability: {
      name: "Emma White",
      email: "emma.white@email.com",
      phoneNumber: "+1234567897",
      qualifications: "B.A. in Special Education",
      yearsOfExperience: 6,
    },
    maleWithDisability: {
      name: "Michael Brown",
      email: "michael.brown@email.com",
      phoneNumber: "+1234567898",
      qualifications: "M.A. in Disability Studies",
      yearsOfExperience: 8,
    },
  },
  foundingBody: "Community Education Initiative",
  lastUpdated: "2024-06-05T08:21:08.487Z",
};

export default function BOG() {
  const [data, setData] = useState<SchoolData>(initialData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: keyof SchoolData,
    field: string,
    index?: number
  ) => {
    const { name, value } = e.target;
    setData((prevData) => {
      const sectionData = prevData[section];

      if (section === "seniorTeachers" && typeof index === "number") {
        const newSeniorTeachers = [...prevData.seniorTeachers];
        newSeniorTeachers[index] = {
          ...newSeniorTeachers[index],
          [name]: value,
        };
        return { ...prevData, seniorTeachers: newSeniorTeachers };
      } else if (section === "parentRepresentatives") {
        return {
          ...prevData,
          parentRepresentatives: {
            ...prevData.parentRepresentatives,
            [field]: {
              ...prevData.parentRepresentatives[
                field as keyof typeof prevData.parentRepresentatives
              ],
              [name]: value,
            },
          },
        };
      } else if (sectionData && typeof sectionData === "object") {
        return {
          ...prevData,
          [section]: {
            ...sectionData,
            [name]: value,
          },
        };
      }
      return { ...prevData, [section]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    console.log("Updated data:", data);
    alert("Data updated successfully!");
  };

  const renderPersonFields = (
    person: Person,
    section: keyof SchoolData,
    field: string,
    index?: number
  ) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${section}-${field}-name`}>Name</Label>
          <Input
            id={`${section}-${field}-name`}
            name="name"
            value={person.name}
            onChange={(e) => handleInputChange(e, section, field, index)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${section}-${field}-email`}>Email</Label>
          <Input
            id={`${section}-${field}-email`}
            name="email"
            type="email"
            value={person.email}
            onChange={(e) => handleInputChange(e, section, field, index)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${section}-${field}-phone`}>Phone Number</Label>
          <Input
            id={`${section}-${field}-phone`}
            name="phoneNumber"
            type="tel"
            value={person.phoneNumber}
            onChange={(e) => handleInputChange(e, section, field, index)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${section}-${field}-experience`}>
            Years of Experience
          </Label>
          <Input
            id={`${section}-${field}-experience`}
            name="yearsOfExperience"
            type="number"
            value={person.yearsOfExperience}
            onChange={(e) => handleInputChange(e, section, field, index)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${section}-${field}-qualifications`}>
          Qualifications
        </Label>
        <Input
          id={`${section}-${field}-qualifications`}
          name="qualifications"
          value={person.qualifications}
          onChange={(e) => handleInputChange(e, section, field, index)}
        />
      </div>
    </div>
  );

  const renderStudentFields = (student: Student, section: keyof SchoolData) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${section}-name`}>Name</Label>
          <Input
            id={`${section}-name`}
            name="name"
            value={student.name}
            onChange={(e) => handleInputChange(e, section, "name")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${section}-grade`}>Grade</Label>
          <Input
            id={`${section}-grade`}
            name="grade"
            value={student.grade}
            onChange={(e) => handleInputChange(e, section, "grade")}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${section}-age`}>Age</Label>
          <Input
            id={`${section}-age`}
            name="age"
            type="number"
            value={student.age}
            onChange={(e) => handleInputChange(e, section, "age")}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${section}-achievements`}>Special Achievements</Label>
        <Input
          id={`${section}-achievements`}
          name="specialAchievements"
          value={student.specialAchievements}
          onChange={(e) => handleInputChange(e, section, "specialAchievements")}
        />
      </div>
    </div>
  );

  const renderSection = (title: string, content: React.ReactNode) => (
    <Collapsible className="w-full">
      <Card>
        <CardHeader>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <CardTitle>{title}</CardTitle>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>{content}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );

  return (
    <div className="min-h-screen">
      <div className=" space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Board Of Governors</CardTitle>
                <CardDescription>
                  View and edit Board Of Governors/ School Committee Info
                </CardDescription>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
              >
                {isEditing ? (
                  <Save className="mr-2 h-4 w-4" />
                ) : (
                  <Edit className="mr-2 h-4 w-4" />
                )}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school-code">School Code</Label>
                  <Input
                    id="school-code"
                    value={data.code}
                    onChange={(e) => handleInputChange(e, "code", "code")}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founding-body">Founding Body</Label>
                  <Input
                    id="founding-body"
                    value={data.foundingBody}
                    onChange={(e) =>
                      handleInputChange(e, "foundingBody", "foundingBody")
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {renderSection(
                "Head Teacher",
                isEditing ? (
                  renderPersonFields(
                    data.headTeacher,
                    "headTeacher",
                    "headTeacher"
                  )
                ) : (
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong> {data.headTeacher.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {data.headTeacher.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {data.headTeacher.phoneNumber}
                    </p>
                    <p>
                      <strong>Qualifications:</strong>{" "}
                      {data.headTeacher.qualifications}
                    </p>
                    <p>
                      <strong>Experience:</strong>{" "}
                      {data.headTeacher.yearsOfExperience} years
                    </p>
                  </div>
                )
              )}

              {renderSection(
                "Deputy Head Teacher",
                isEditing ? (
                  renderPersonFields(
                    data.deputyHeadTeacher,
                    "deputyHeadTeacher",
                    "deputyHeadTeacher"
                  )
                ) : (
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong> {data.deputyHeadTeacher.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {data.deputyHeadTeacher.email}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {data.deputyHeadTeacher.phoneNumber}
                    </p>
                    <p>
                      <strong>Qualifications:</strong>{" "}
                      {data.deputyHeadTeacher.qualifications}
                    </p>
                    <p>
                      <strong>Experience:</strong>{" "}
                      {data.deputyHeadTeacher.yearsOfExperience} years
                    </p>
                  </div>
                )
              )}

              {renderSection(
                "Senior Teachers",
                isEditing
                  ? data.seniorTeachers.map((teacher, index) => (
                      <div key={index} className="mb-4">
                        <h4 className="font-medium mb-2">
                          Senior Teacher {index + 1}
                        </h4>
                        {renderPersonFields(
                          teacher,
                          "seniorTeachers",
                          "seniorTeachers",
                          index
                        )}
                        {index < data.seniorTeachers.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))
                  : data.seniorTeachers.map((teacher, index) => (
                      <div key={index} className="mb-4">
                        <h4 className="font-medium mb-2">
                          Senior Teacher {index + 1}
                        </h4>
                        <div className="space-y-2">
                          <p>
                            <strong>Name:</strong> {teacher.name}
                          </p>
                          <p>
                            <strong>Email:</strong> {teacher.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {teacher.phoneNumber}
                          </p>
                          <p>
                            <strong>Qualifications:</strong>{" "}
                            {teacher.qualifications}
                          </p>
                          <p>
                            <strong>Experience:</strong>{" "}
                            {teacher.yearsOfExperience} years
                          </p>
                        </div>
                        {index < data.seniorTeachers.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))
              )}

              {renderSection(
                "Head Girl",
                isEditing ? (
                  renderStudentFields(data.headGirl, "headGirl")
                ) : (
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong> {data.headGirl.name}
                    </p>
                    <p>
                      <strong>Grade:</strong> {data.headGirl.grade}
                    </p>
                    <p>
                      <strong>Age:</strong> {data.headGirl.age}
                    </p>
                    <p>
                      <strong>Special Achievements:</strong>{" "}
                      {data.headGirl.specialAchievements}
                    </p>
                  </div>
                )
              )}

              {renderSection(
                "Head Boy",
                isEditing ? (
                  renderStudentFields(data.headBoy, "headBoy")
                ) : (
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong> {data.headBoy.name}
                    </p>
                    <p>
                      <strong>Grade:</strong> {data.headBoy.grade}
                    </p>
                    <p>
                      <strong>Age:</strong> {data.headBoy.age}
                    </p>
                    <p>
                      <strong>Special Achievements:</strong>{" "}
                      {data.headBoy.specialAchievements}
                    </p>
                  </div>
                )
              )}

              {renderSection(
                "School Officer",
                isEditing ? (
                  renderPersonFields(
                    data.schoolOfficer,
                    "schoolOfficer",
                    "schoolOfficer"
                  )
                ) : (
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong> {data.schoolOfficer.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {data.schoolOfficer.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {data.schoolOfficer.phoneNumber}
                    </p>
                    <p>
                      <strong>Qualifications:</strong>{" "}
                      {data.schoolOfficer.qualifications}
                    </p>
                    <p>
                      <strong>Experience:</strong>{" "}
                      {data.schoolOfficer.yearsOfExperience} years
                    </p>
                  </div>
                )
              )}

              {renderSection(
                "Parent Representatives",
                <>
                  <h4 className="font-medium mb-2">Female Representative</h4>
                  {isEditing ? (
                    renderPersonFields(
                      data.parentRepresentatives.female,
                      "parentRepresentatives",
                      "female"
                    )
                  ) : (
                    <div className="space-y-2">
                      <p>
                        <strong>Name:</strong>{" "}
                        {data.parentRepresentatives.female.name}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {data.parentRepresentatives.female.email}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {data.parentRepresentatives.female.phoneNumber}
                      </p>
                      <p>
                        <strong>Qualifications:</strong>{" "}
                        {data.parentRepresentatives.female.qualifications}
                      </p>
                      <p>
                        <strong>Experience:</strong>{" "}
                        {data.parentRepresentatives.female.yearsOfExperience}{" "}
                        years
                      </p>
                    </div>
                  )}
                  <Separator className="my-4" />
                  <h4 className="font-medium mb-2">Male Representative</h4>
                  {isEditing ? (
                    renderPersonFields(
                      data.parentRepresentatives.male,
                      "parentRepresentatives",
                      "male"
                    )
                  ) : (
                    <div className="space-y-2">
                      <p>
                        <strong>Name:</strong>{" "}
                        {data.parentRepresentatives.male.name}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {data.parentRepresentatives.male.email}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {data.parentRepresentatives.male.phoneNumber}
                      </p>
                      <p>
                        <strong>Qualifications:</strong>{" "}
                        {data.parentRepresentatives.male.qualifications}
                      </p>
                      <p>
                        <strong>Experience:</strong>{" "}
                        {data.parentRepresentatives.male.yearsOfExperience}{" "}
                        years
                      </p>
                    </div>
                  )}
                  <Separator className="my-4" />
                  <h4 className="font-medium mb-2">
                    Female Representative (Learner with Disability)
                  </h4>
                  {isEditing ? (
                    renderPersonFields(
                      data.parentRepresentatives.femaleWithDisability,
                      "parentRepresentatives",
                      "femaleWithDisability"
                    )
                  ) : (
                    <div className="space-y-2">
                      <p>
                        <strong>Name:</strong>{" "}
                        {data.parentRepresentatives.femaleWithDisability.name}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {data.parentRepresentatives.femaleWithDisability.email}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {
                          data.parentRepresentatives.femaleWithDisability
                            .phoneNumber
                        }
                      </p>
                      <p>
                        <strong>Qualifications:</strong>{" "}
                        {
                          data.parentRepresentatives.femaleWithDisability
                            .qualifications
                        }
                      </p>
                      <p>
                        <strong>Experience:</strong>{" "}
                        {
                          data.parentRepresentatives.femaleWithDisability
                            .yearsOfExperience
                        }{" "}
                        years
                      </p>
                    </div>
                  )}
                  <Separator className="my-4" />
                  <h4 className="font-medium mb-2">
                    Male Representative (Learner with Disability)
                  </h4>
                  {isEditing ? (
                    renderPersonFields(
                      data.parentRepresentatives.maleWithDisability,
                      "parentRepresentatives",
                      "maleWithDisability"
                    )
                  ) : (
                    <div className="space-y-2">
                      <p>
                        <strong>Name:</strong>{" "}
                        {data.parentRepresentatives.maleWithDisability.name}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {data.parentRepresentatives.maleWithDisability.email}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {
                          data.parentRepresentatives.maleWithDisability
                            .phoneNumber
                        }
                      </p>
                      <p>
                        <strong>Qualifications:</strong>{" "}
                        {
                          data.parentRepresentatives.maleWithDisability
                            .qualifications
                        }
                      </p>
                      <p>
                        <strong>Experience:</strong>{" "}
                        {
                          data.parentRepresentatives.maleWithDisability
                            .yearsOfExperience
                        }{" "}
                        years
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="text-sm text-gray-500">
                Last Updated: {new Date(data.lastUpdated).toLocaleString()}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
